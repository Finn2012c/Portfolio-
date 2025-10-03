local RS=game:GetService("ReplicatedStorage")
local P=game:GetService("Players").LocalPlayer
local UIS=game:GetService("UserInputService")
local fly=false

RS.ServerToggleFly.OnClientEvent:Connect(function(e)
    fly=e
    local h=P.Character and P.Character:FindFirstChildOfClass("Humanoid")
    if h then h.PlatformStand=e end
end)

UIS.InputBegan:Connect(function(i,g)
    if g then return end
    if i.KeyCode==Enum.KeyCode.F then RS.RequestToggleFly:FireServer() end
end)

game:GetService("RunService").RenderStepped:Connect(function()
    if not fly or not P.Character then return end
    local hrp=P.Character:FindFirstChild("HumanoidRootPart")
    if not hrp then return end
    local dir=Vector3.zero
    if UIS:IsKeyDown(Enum.KeyCode.W) then dir+=workspace.CurrentCamera.CFrame.LookVector end
    if UIS:IsKeyDown(Enum.KeyCode.S) then dir-=workspace.CurrentCamera.CFrame.LookVector end
    if UIS:IsKeyDown(Enum.KeyCode.A) then dir-=workspace.CurrentCamera.CFrame.RightVector end
    if UIS:IsKeyDown(Enum.KeyCode.D) then dir+=workspace.CurrentCamera.CFrame.RightVector end
    if UIS:IsKeyDown(Enum.KeyCode.Space) then dir+=Vector3.yAxis end
    if UIS:IsKeyDown(Enum.KeyCode.LeftControl) then dir-=Vector3.yAxis end
    hrp.Velocity=dir.Magnitude>0 and dir.Unit*50 or Vector3.zero
end)
