import time
import uiautomation as uia
from aiohttp import web
import sys


def createJson(body='', message='', status=0):
    return {
        'body': body,
        'message': message,
        'status': status,
    }


class WeChat:
    def __init__(self):
        uia.SetGlobalSearchTimeout(2.0)
        try:
            self.weChatWindow = uia.WindowControl(ClassName="WeChatMainWndForPC")
        except LookupError:
            self.weChatWindow = None
            print("请登入微信")
        finally:
            if self.weChatWindow:
                try:
                    self.messageList = self.weChatWindow.ListControl(Name="消息")
                except LookupError:
                    self.messageList = None
                    print("找不到消息栏，请稍后重试，或者提交bug")
                try:
                    self.chatterList = self.weChatWindow.ListControl(Name="会话")
                except LookupError:
                    self.messageList = None
                    print("找不到聊天会话栏，请稍后重试，或者提交bug")
        self.lastId = None

        self.candidateChatList = []
        self.chatNameList = []
        self.idList = []
        self.chatMessageList = []
        self.index = 0
        # self.outputFile = open("output.txt", 'w')

    @staticmethod
    def splitMessage(msgItem):
        uia.SetGlobalSearchTimeout(0)
        isPerson = True
        try:
            _ = msgItem.ButtonControl(foundIndex=1).Name
        except LookupError:
            isPerson = False
        if isPerson:
            try:
                name = msgItem.TextControl(searchDepth=4).Name
            except LookupError:
                index = 1
                name = ""
                while name == "":
                    name = msgItem.ButtonControl(foundIndex=index).Name
                    index += 1
            msg = (name, msgItem.Name, "".join([str(i) for i in msgItem.GetRuntimeId()]))
        else:
            children = msgItem.GetChildren()
            if len(children) == 1 and children[0].ControlTypeName == "TextControl":
                msg = ("TIME", msgItem.Name, "".join([str(i) for i in msgItem.GetRuntimeId()]))
            else:
                msg = None
        uia.SetGlobalSearchTimeout(2.0)
        return msg

    def getNewMessage(self, msgItems):
        msgDocker = []
        for msgItem in msgItems:
            msg = self.splitMessage(msgItem)
            if msg and int(msg[2]) > self.idList[self.index]:
                msgDocker.append(msg)
            else:
                break
        if msgDocker:
            self.idList[self.index] = int(msgDocker[0][2])
        msgDocker.reverse()
        return msgDocker

    def listenNewMessage(self):
        # uia.SetGlobalSearchTimeout(1.0)
        msgItems = self.messageList.GetChildren()
        msgItems.reverse()
        msg = None
        for msgItem in msgItems:
            msg = self.splitMessage(msgItem)
            # 找到了某一条消息
            if msg and msg[0] != "TIME":
                break
        if msg is not None:
            if self.idList[self.index] is None:
                self.idList[self.index] = int(msg[2])
                # uia.SetGlobalSearchTimeout(10.0)
                return [msg]
            else:
                if self.idList[self.index] < int(msg[2]):
                    # uia.SetGlobalSearchTimeout(10.0)
                    return self.getNewMessage(msgItems)
                else:
                    # uia.SetGlobalSearchTimeout(10.0)
                    return None
        else:
            # uia.SetGlobalSearchTimeout(10.0)
            return None

    def getChatName(self):
        # uia.SetGlobalSearchTimeout(1.0)
        try:
            name = self.weChatWindow.PaneControl(foundIndex=1).PaneControl(foundIndex=1)\
                .PaneControl(searchDepth=1, foundIndex=2).TextControl().Name
        except LookupError:
            try:
                name = self.weChatWindow.PaneControl(foundIndex=2).PaneControl(foundIndex=1) \
                    .PaneControl(searchDepth=1, foundIndex=2).TextControl().Name
            except LookupError:
                # uia.SetGlobalSearchTimeout(10.0)
                return None
        try:
            rIndex = name.rindex("(")
            # uia.SetGlobalSearchTimeout(10.0)
            return name[:rIndex]
        except ValueError:
            # uia.SetGlobalSearchTimeout(10.0)
            return name

    def putChatName(self):
        name = self.getChatName()
        if name:
            if name not in self.chatNameList:
                self.candidateChatList.append(name)
                return web.json_response(data=createJson(name, f"检测到聊天 {name}，是否将其添加到观察列表？", 0))
            else:
                return web.json_response(data=createJson('', "已经添加过该聊天名称了", 1))
        else:
            return web.json_response(data=createJson('', "获取当前聊天名称失败，请稍后再试或者提交bug", 1))

    def confirmChatName(self, name, agree):
        if name in self.candidateChatList:
            self.candidateChatList.remove(name)
            if agree:
                self.chatNameList.append(name)
                self.idList.append(None)
                self.chatMessageList.append([])
                return web.json_response(data=createJson(name, f"成功将{name}添加进观察列表", 0))

    def listenOne(self):
        chatName = self.getChatName()
        try:
            self.index = self.chatNameList.index(chatName)
        except ValueError:
            return web.json_response(data=createJson('', "当前聊天不在观察列表中，请更换聊天对象，或者将该聊天添加入观察列表", 1))
        newMessages = self.listenNewMessage()
        if newMessages:
            for msg in newMessages:
                self.chatMessageList[self.index].append(msg)
                # self.outputFile.write(str(msg) + '\n')
                # self.outputFile.flush()
            return web.json_response(data=createJson(str({"message": str(newMessages), "chatName": chatName}), "", 0))
        return web.json_response(data=createJson("", "", 1))

    def listen(self):
        outputFile = open("output.txt", 'w')
        self.putChatName()
        while True:
            time.sleep(1)
            # print("loop")
            chatName = self.getChatName()
            try:
                self.index = self.chatNameList.index(chatName)
            except ValueError:
                # print("目前聊天不在序列中")
                continue
            newMessages = self.listenNewMessage()
            if newMessages:
                for msg in newMessages:
                    self.chatMessageList[self.index].append(msg)
                    outputFile.write(str(msg) + '\n')
                    outputFile.flush()

    def getUserName(self):
        name = ''
        try:
            name = self.weChatWindow.ToolBarControl(Name="导航").GetChildren()[0].Name
        except LookupError:
            return web.json_response(data=createJson('', "无法读取微信名称，请登入微信或者稍后再试", 1))
        return web.json_response(data=createJson(name, "", 0))

    def test(self, name):
        return web.json_response(data={
            'body': name,
            'message': "哈哈",
            'status': 1,
        })

    def executeFunc(self, request):

        try:
            self.weChatWindow = uia.WindowControl(ClassName="WeChatMainWndForPC")
        except LookupError:
            self.weChatWindow = None
            print("请登入微信")
        finally:
            if self.weChatWindow:
                try:
                    self.messageList = self.weChatWindow.ListControl(Name="消息")
                except LookupError:
                    self.messageList = None
                    print("找不到消息栏，请稍后重试，或者提交bug")
                try:
                    self.chatterList = self.weChatWindow.ListControl(Name="会话")
                except LookupError:
                    self.messageList = None
                    print("找不到聊天会话栏，请稍后重试，或者提交bug")

        if int(request.query.get('funcNum')) == 0:
            return self.test(request.query.get('name'))
        if int(request.query.get('funcNum')) == 1:
            return self.getUserName()
        if int(request.query.get('funcNum')) == 2:
            return self.listenOne()
        if int(request.query.get('funcNum')) == 3:
            return self.putChatName()
        if int(request.query.get('funcNum')) == 4:
            return self.confirmChatName(request.query.get('name'), request.query.get('agree'))
        if int(request.query.get('funcNum')) == 100:
            return self.test(request.query.get('name'))


wechat = WeChat()
app = web.Application()
app.add_routes([web.get('/func', wechat.executeFunc)])
web.run_app(app, port=5031)
