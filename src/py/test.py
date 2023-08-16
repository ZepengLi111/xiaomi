# import zerorpc
#
# c = zerorpc.Client()
# c.connect("tcp://127.0.0.1:4242")
# print(c.hello("RPC"))

import uiautomation as uia

weChat = uia.WindowControl(ClassName="WeChatMainWndForPC")
# print(weChat)
chatHistoryButton = weChat.ButtonControl(Name="聊天记录")
exitButton = weChat.ButtonControl(Name="关闭")
# print(chatHistoryButton)
# print(exitButton)
# weChat.SwitchToThisWindow()
# chatHistoryButton.Click()

weChat.WheelUp(wheelTimes=int(500*10))
weChat.ListControl(Name="消息")