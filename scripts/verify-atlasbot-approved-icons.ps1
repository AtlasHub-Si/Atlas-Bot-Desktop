$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$repo = (Get-Location).Path
$out = Join-Path $repo '.openbot-build/atlas-icons'
$unpacked = Join-Path $repo 'dist/win-unpacked'
$expectedPng = 'f60d3a1c7f8ef33a480324dcbe89743e952d6819eaad3de83f258029ea31707b'
$expectedIco = 'b3e5b42bc68fe6af3e8ca224738b66979d7b840fcc8c1c2b2ab773833720479a'
foreach ($variant in @('production', 'dev', 'preview')) {
    $file = Join-Path $unpacked ("resources/icons/icon-" + $variant + '.png')
    if ((Get-FileHash -LiteralPath $file -Algorithm SHA256).Hash.ToLower() -ne $expectedPng) {
        throw "Wrong packaged runtime icon: $variant"
    }
}
if ((Get-FileHash 'build/icon-production.ico' -Algorithm SHA256).Hash.ToLower() -ne $expectedIco) {
    throw 'Wrong NSIS icon source'
}
$renderer = Join-Path $unpacked 'resources/app.asar'
# ExtractAssociatedIcon reads the PE icon that Windows Explorer and shortcuts use.
$exe = Join-Path $unpacked 'AtlasBot.exe'
$installer = Join-Path $repo 'dist/AtlasBot-0.70.0-x64.exe'
$exeIcon = [Drawing.Icon]::ExtractAssociatedIcon($exe)
$installerIcon = [Drawing.Icon]::ExtractAssociatedIcon($installer)
$expectedIcon = [Drawing.Icon]::new((Join-Path $repo 'build/icon-production.ico'), 32, 32)
$expectedBitmap = $expectedIcon.ToBitmap()
$exeBitmap = $exeIcon.ToBitmap()
$installerBitmap = $installerIcon.ToBitmap()
function Compare-Icon($actual, $expected) {
    if ($actual.Width -ne $expected.Width -or $actual.Height -ne $expected.Height) {
        throw 'Unexpected PE icon size'
    }
    $different = 0
    for ($y=0; $y -lt $expected.Height; $y++) {
        for ($x=0; $x -lt $expected.Width; $x++) {
            if ($actual.GetPixel($x,$y).ToArgb() -ne $expected.GetPixel($x,$y).ToArgb()) { $different++ }
        }
    }
    return $different
}
$exeDifferent = Compare-Icon $exeBitmap $expectedBitmap
$installerDifferent = Compare-Icon $installerBitmap $expectedBitmap
if ($exeDifferent -ne 0 -or $installerDifferent -ne 0) {
    throw "Embedded PE icon differs from approved ICO (app=$exeDifferent, installer=$installerDifferent)"
}
$exeBitmap.Save((Join-Path $out 'exe-icon.png'), [Drawing.Imaging.ImageFormat]::Png)
$installerBitmap.Save((Join-Path $out 'installer-icon.png'), [Drawing.Imaging.ImageFormat]::Png)
Copy-Item -LiteralPath 'src/renderer/public/atlasbot-favicon-32.png' -Destination (Join-Path $out 'favicon-32.png')
$sheet = [Drawing.Bitmap]::new(700,220)
$graphics = [Drawing.Graphics]::FromImage($sheet)
$graphics.Clear([Drawing.Color]::FromArgb(12,18,35))
$font = [Drawing.Font]::new('Segoe UI',14)
$white = [Drawing.Brushes]::White
$graphics.DrawString('AtlasBot approved V0.7 / packaged PE resources', $font, $white, 12,12)
$graphics.InterpolationMode = [Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
$graphics.DrawImage($exeBitmap,32,60,96,96)
$graphics.DrawImage($installerBitmap,260,60,96,96)
$graphics.DrawImage($expectedBitmap,488,60,96,96)
$graphics.DrawString('Application', $font, $white, 20,170)
$graphics.DrawString('Installer', $font, $white, 250,170)
$graphics.DrawString('Approved source', $font, $white, 465,170)
$sheet.Save((Join-Path $out 'packaged-icons.png'), [Drawing.Imaging.ImageFormat]::Png)
$graphics.Dispose()
$sheet.Dispose()
$font.Dispose()
$report = [ordered]@{
    passed = $true
    runtimePngSha256 = $expectedPng
    sourceIcoSha256 = $expectedIco
    applicationPePixelDifferences = $exeDifferent
    installerPePixelDifferences = $installerDifferent
    sourceCommit = $env:GITHUB_SHA
    uiRuntime = 'Not tested by PE resource verification'
    taskbarTray = 'Runtime images verified; Windows visual acceptance still required'
    notifications = 'Canary AUMID preserved; actual OS toast not triggered'
}
$report | ConvertTo-Json | Set-Content (Join-Path $out 'package-icons.json') -Encoding utf8
$report | ConvertTo-Json
$exeBitmap.Dispose()
$installerBitmap.Dispose()
$expectedBitmap.Dispose()
$expectedIcon.Dispose()
$exeIcon.Dispose()
$installerIcon.Dispose()
