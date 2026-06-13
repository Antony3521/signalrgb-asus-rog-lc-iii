# SignalRGB Plugin: ASUS ROG Strix LC III

Unofficial plugin for [SignalRGB](https://www.signalrgb.com/) that enables full, independent 4-zone RGB control for the **ASUS ROG Strix LC III (240 / 280 / 360)** AIO liquid cooler pump cover.

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![SignalRGB](https://img.shields.io/badge/SignalRGB-Plugin-blue)

## Features
- ✅ Full independent control of all 4 LED zones on the pump cover.
- ✅ Seamless integration with SignalRGB Canvas (gradients, waves, audio reactivity, etc.).
- ✅ "Forced Color" and "Shutdown Color" options in plugin settings.
- ✅ No conflicts with other devices (fans are handled separately via motherboard ARGB headers).

## Installation

1. **Close SignalRGB** completely (make sure it's exited from the system tray).
2. **Close ASUS Armoury Crate** and any other conflicting RGB software (Aura Sync, iCUE, etc.).
3. Navigate to your SignalRGB plugins folder. By default, this is:
   - `C:\Users\<YourUsername>\Documents\WhirlwindFX\Plugins`
   - *Alternatively:* `C:\Users\<YourUsername>\AppData\Local\VortxEngine\app-<version>\Signal-x64\Plugins\Asus`
4. If the `ASUS` folder does not exist, create it.
5. Download the [`AsusRogLcIII.js`](./AsusRogLcIII.js) file from this repository.
6. Place the `AsusRogLcIII.js` file inside the Plugins folder or in Asus folder *Alternatively*.
7. **Launch SignalRGB**.
8. Go to the **Devices** tab. Your "ASUS ROG LC III Pump Cover" should now appear and be fully controllable!

## Technical Details (For Developers)
This plugin was reverse-engineered by analyzing USB HID traffic from ASUS Armoury Crate using Wireshark/USBPcap.

- **VID:** `0x0B05`
- **PID:** `0x1B29`
- **Interface:** `2`
- **Usage:** `0x00A1`
- **Usage Page:** `0xFF72`

The color update packet structure is:
`[0xEC, 0x40, 0x80, 0x00, 0x04, R1, G1, B1, R2, G2, B2, R3, G3, B3, R4, G4, B4, ...padding to 65 bytes]`

*Note: The plugin exports both `Validate` and `validate` functions to ensure compatibility across different versions of the SignalRGB engine, which has a known quirk regarding function name casing.*

## Acknowledgments
- The SignalRGB community for the excellent plugin architecture.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
