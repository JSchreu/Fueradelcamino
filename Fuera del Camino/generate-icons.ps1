# Maak de icons directory als deze niet bestaat
New-Item -ItemType Directory -Path "icons" -Force

# Download de icon bestanden
$iconUrls = @{
    "icon-192x192.png" = "https://raw.githubusercontent.com/JSchreu/Fuera-del-Camino/main/icons/icon-192x192.png"
    "icon-512x512.png" = "https://raw.githubusercontent.com/JSchreu/Fuera-del-Camino/main/icons/icon-512x512.png"
}

foreach ($icon in $iconUrls.GetEnumerator()) {
    $outputPath = Join-Path "icons" $icon.Key
    Write-Host "Downloading $($icon.Key)..."
    Invoke-WebRequest -Uri $icon.Value -OutFile $outputPath
} 