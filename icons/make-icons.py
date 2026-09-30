"""Laver icon-192.png og icon-512.png uden eksterne biblioteker.
Kør: python icons/make-icons.py (fra drukspil-mappen)."""
import math, struct, zlib, os

def smooth(d, w=1.0):
    """1 inde i formen, 0 udenfor, blødt over w pixels (d = signeret afstand, negativ inde)."""
    if d <= -w: return 1.0
    if d >= w: return 0.0
    t = (d + w) / (2 * w)
    return 1 - (t * t * (3 - 2 * t))

def blend(base, col, a):
    return tuple(int(round(base[i] * (1 - a) + col[i] * a)) for i in range(3))

def draw(size):
    rows = []
    cx, cy, r = 0.5 * size, 0.585 * size, 0.293 * size
    fx0, fy0, fx1, fy1 = 0.545 * size, 0.30 * size, 0.62 * size, 0.185 * size
    sx, sy, sr = 0.645 * size, 0.205 * size, 0.058 * size
    fw = 0.028 * size
    for y in range(size):
        row = bytearray()
        for x in range(size):
            px, py = x + 0.5, y + 0.5
            # baggrund: radial gradient orange -> mørk rød
            dx, dy = (px - 0.5 * size) / size, (py - 0.35 * size) / size
            t = min(1.0, math.sqrt(dx * dx + dy * dy) / 0.75)
            if t < 0.55:
                k = t / 0.55; col = blend((255, 177, 92), (255, 106, 42), k)
            else:
                k = (t - 0.55) / 0.45; col = blend((255, 106, 42), (179, 40, 26), k)
            # lunte (tyk linje)
            vx, vy = fx1 - fx0, fy1 - fy0
            L = vx * vx + vy * vy
            u = max(0.0, min(1.0, ((px - fx0) * vx + (py - fy0) * vy) / L))
            qx, qy = fx0 + u * vx, fy0 + u * vy
            dfuse = math.hypot(px - qx, py - qy) - fw
            col = blend(col, (203, 168, 131), smooth(dfuse))
            # gnist med glød
            ds = math.hypot(px - sx, py - sy)
            col = blend(col, (255, 214, 106), 0.35 * smooth(ds - sr * 1.7, sr * 0.6))
            col = blend(col, (255, 214, 106), smooth(ds - sr))
            # bomben (mørk kugle med highlight)
            db = math.hypot(px - cx, py - cy)
            if db < r + 1.5:
                hx, hy = (px - (cx - 0.14 * r * 2)) / r, (py - (cy - 0.18 * r * 2)) / r
                h = min(1.0, math.sqrt(hx * hx + hy * hy) / 1.4)
                bomb = blend((74, 80, 120), (11, 13, 24), h)
                col = blend(col, bomb, smooth(db - r))
            row += bytes(col) + b'\xff'
        rows.append(bytes(row))
    return rows

def png(size, rows):
    raw = b''.join(b'\x00' + r for r in rows)
    def chunk(t, d): return struct.pack('>I', len(d)) + t + d + struct.pack('>I', zlib.crc32(t + d) & 0xffffffff)
    return (b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', size, size, 8, 6, 0, 0, 0))
            + chunk(b'IDAT', zlib.compress(raw, 9)) + chunk(b'IEND', b''))

here = os.path.dirname(os.path.abspath(__file__))
for s in (192, 512):
    with open(os.path.join(here, f'icon-{s}.png'), 'wb') as f:
        f.write(png(s, draw(s)))
    print('skrev icon-%d.png' % s)
