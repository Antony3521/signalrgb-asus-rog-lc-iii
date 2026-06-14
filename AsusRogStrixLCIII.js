/**
 * SignalRGB Plugin for ASUS ROG Strix LC III (240 / 280 / 360)
 * 
 * This plugin enables full independent 4-zone RGB control for the pump cover.
 * Reverse-engineered based on USB HID traffic analysis of ASUS Armoury Crate.
 * 
 * Hardware Details:
 * - Vendor ID: 0x0B05 (ASUSTek Computer Inc.)
 * - Product ID: 0x1B29 (AURA LED Controller)
 * - Interface: 2, Usage: 0x00A1, Usage Page: 0xFF72
 */

export function Name() { return "ASUS ROG LC III Pump Cover"; }
export function VendorId() { return 0x0B05; }
export function ProductId() { return 0x1B29; }
export function Publisher() { return "Community"; }
export function Documentation() { return "https://github.com/Antony3521/signalrgb-asus-rog-lc-iii"; }
export function Version() { return "1.0.0"; }
export function Type() { return "hid"; }

// The pump cover contains 4 independent LED zones arranged in a linear sequence.
// We use a 4x1 grid to represent this in the SignalRGB layout.
export function Size() { return [4, 1]; }
export function DefaultPosition() { return [0, 0]; }
export function DefaultScale() { return 8.0; }
export function SubdeviceController() { return false; }

export function LedNames() { 
    return ["Zone 1 (Left)", "Zone 2", "Zone 3", "Zone 4 (Right)"]; 
}

export function LedPositions() { 
    return [
        [0, 0], // Zone 1
        [1, 0], // Zone 2
        [2, 0], // Zone 3
        [3, 0]  // Zone 4
    ]; 
}

/* global
LightingMode:readonly
forcedColor:readonly
shutdownColor:readonly
*/
export function ControllableParameters() {
    return [
        { "property": "LightingMode",  "group": "lighting", "label": "Lighting Mode",  "type": "combobox", "values": ["Canvas", "Forced"], "default": "Canvas" },
        { "property": "forcedColor",   "group": "lighting", "label": "Forced Color",   "type": "color",    "default": "#FF0000" },
        { "property": "shutdownColor", "group": "lighting", "label": "Shutdown Color", "type": "color",    "default": "#000000" },
    ];
}

/**
 * SignalRGB has a known quirk where it sometimes looks for 'Validate' (capital V) 
 * and sometimes 'validate' (lowercase v) depending on the engine version. 
 * Exporting both ensures maximum compatibility.
 */
export function Validate(endpoint) {
    return endpoint.interface === 2 &&
           endpoint.usage === 0x00A1 &&
           endpoint.usage_page === 0xFF72;
}
export function validate(endpoint) { return Validate(endpoint); }

export function Initialize() {
    device.setControllableLeds(LedNames(), LedPositions());
    device.write([0xEC, 0x35, 0x00, 0x00, 0x00, 0xFF, 0x00, 0xFE, 0x01,
                  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                  0x00, 0x64, 0x64, 0x64], 65);
    device.write([0xEC, 0x3B, 0x00, 0xE3, 0xFF], 65);
}

export function Render() {
    let colors;
    
    if (LightingMode === "Forced") {
        // In Forced mode, all 4 zones display the same solid color
        const c = hexToRgb(forcedColor);
        colors = [c, c, c, c];
        device.color(0, 0, c[0], c[1], c[2]); // Sync internal state
    } else {
        // In Canvas mode, read the color of each specific zone from the layout
        colors = [
            device.color(0, 0), // Zone 1
            device.color(1, 0), // Zone 2
            device.color(2, 0), // Zone 3
            device.color(3, 0)  // Zone 4
        ];
    }
    
    // Packet structure based on USBPcap analysis:
    // [0] 0xEC : Report ID / Header
    // [1] 0x40 : Command (Set Color)
    // [2] 0x80 : Unknown/Reserved (Consistently 0x80 in Armoury Crate traffic)
    // [3] 0x00 : Reserved
    // [4] 0x04 : Number of LED zones being updated (4)
    // [5-16]   : 4 x RGB values (3 bytes each)
    const packet = [0xEC, 0x40, 0x80, 0x00, 0x04];
    for (let i = 0; i < 4; i++) {
        packet.push(colors[i][0], colors[i][1], colors[i][2]);
    }
    
    device.write(packet, 65);
}

export function Shutdown() {
    const color = hexToRgb(shutdownColor);
    const packet = [0xEC, 0x40, 0x80, 0x00, 0x04];
    
    // Apply shutdown color to all 4 zones
    for (let i = 0; i < 4; i++) {
        packet.push(color[0], color[1], color[2]);
    }
    device.write(packet, 65);
}

export function ImageUrl() {
    // Placeholder image. Can be replaced with a render of the LC III pump.
    return "https://assets.signalrgb.com/devices/default/misc/usb-drive-render.png";
}

/**
 * Helper function to convert HEX color strings (e.g., "#FF0000") to [R, G, B] arrays.
 */
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : [0, 0, 0];
}
