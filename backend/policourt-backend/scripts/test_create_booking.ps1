$json = @{
    email = 'player@policourt.com'
    password = '12341234'
} | ConvertTo-Json

Write-Output "Sending login request..."
$loginResp = Invoke-RestMethod -Method Post -Uri 'http://localhost:4001/api/auth/login' -ContentType 'application/json' -Body $json
Write-Output 'LOGIN_RESPONSE:'
$loginResp | ConvertTo-Json -Depth 5

$token = $loginResp.data.accessToken
Write-Output "TOKEN: $token"

$body = @{
    courtSlug = 'pista-tenis-rapida'
    organizerUsername = 'player'
    sportSlug = 'tennis'
    startTime = '2026-04-08T16:00:00+02:00'
    endTime = '2026-04-08T17:00:00+02:00'
} | ConvertTo-Json

Write-Output "Creating payment intent..."
$res = Invoke-RestMethod -Method Post -Uri 'http://localhost:4001/api/payments/intent' -ContentType 'application/json' -Headers @{ Authorization = "Bearer $token" } -Body $body
Write-Output 'PAYMENT_RESPONSE:'
$res | ConvertTo-Json -Depth 5
