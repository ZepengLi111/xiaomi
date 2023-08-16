import zerorpc
import wx
import uiautomation as uia
print(uia.WindowControl(ClassName='WeChatMainWndForPC'))

wx1 = wx.WeChat()

# 输出当前聊天窗口聊天消息
msgs = wx1.GetAllMessage
for msg in msgs:
    print('%s : %s'%(msg[0], msg[1]))



# s = zerorpc.Server(HelloRPC())
# s.bind("tcp://0.0.0.0:4242")
# s.run()
