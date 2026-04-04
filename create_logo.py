from PIL import Image, ImageDraw, ImageFilter
import math

# Create image with dark background
width, height = 400, 400
img = Image.new('RGBA', (width, height), color=(10, 10, 20, 255))

# Create a gradient background effect
for y in range(height):
    for x in range(width):
        # Dark gradient
        dist = math.sqrt((x-200)**2 + (y-200)**2)
        if dist < 200:
            shade = int(20 - (dist / 200) * 5)
            img.putpixel((x, y), (shade, shade, shade+10, 255))

draw = ImageDraw.Draw(img, 'RGBA')

# OUTER CIRCLE - Silver/Gray metallic border
draw.ellipse([10, 10, 390, 390], outline=(200, 200, 220, 255), width=6)
draw.ellipse([15, 15, 385, 385], outline=(150, 150, 180, 180), width=4)
draw.ellipse([20, 20, 380, 380], outline=(100, 100, 130, 150), width=3)

# Inner dark circle background
draw.ellipse([25, 25, 375, 375], fill=(20, 20, 35, 200))

# Background brain network (top-left quarter)
# Outer circle for brain
draw.ellipse([130, 90, 190, 150], outline=(200, 100, 255, 150), width=2)

# Brain nodes
brain_nodes = [
    (145, 105), (175, 105),  # top
    (140, 140), (180, 140),  # bottom
    (160, 120)  # center
]
for node in brain_nodes:
    draw.ellipse([node[0]-4, node[1]-4, node[0]+4, node[1]+4], fill=(200, 150, 255, 220))
    # Glow
    draw.ellipse([node[0]-6, node[1]-6, node[0]+6, node[1]+6], outline=(200, 100, 255, 100), width=1)

# Connection lines between nodes
connections = [
    [(145, 105), (160, 120)], [(175, 105), (160, 120)],
    [(140, 140), (160, 120)], [(180, 140), (160, 120)],
    [(145, 105), (175, 105)], [(140, 140), (180, 140)]
]
for line in connections:
    draw.line(line, fill=(180, 120, 220, 120), width=1)

# MAIN FLAME - Central focus
# Base flame (wide)
base_flame = [
    (200, 260), (170, 230), (160, 190), (165, 150),
    (200, 140), (235, 150), (240, 190), (230, 230)
]
draw.polygon(base_flame, fill=(255, 100, 0, 255))

# Middle flame section
mid_flame = [
    (200, 140), (180, 115), (175, 75), (185, 55),
    (200, 50), (215, 55), (225, 75), (220, 115)
]
draw.polygon(mid_flame, fill=(255, 140, 20, 255))

# Top flame point
top_flame = [(200, 50), (195, 35), (200, 20), (205, 35)]
draw.polygon(top_flame, fill=(255, 200, 0, 255))

# Flame highlights (bright yellow)
draw.ellipse([190, 90, 210, 130], fill=(255, 255, 100, 180))
draw.ellipse([195, 70, 205, 90], fill=(255, 255, 150, 200))

# Golden glow around flame
draw.ellipse([185, 120, 215, 160], outline=(255, 150, 0, 100), width=2)

# MEDITATION FIGURE - Lotus legs below flame
# Left leg (curved, orange-red)
left_leg_points = [(190, 260), (175, 275), (165, 290)]
draw.line(left_leg_points, fill=(255, 80, 80, 220), width=5)

# Right leg (curved, purple-pink)
right_leg_points = [(210, 260), (225, 275), (235, 290)]
draw.line(right_leg_points, fill=(220, 80, 160, 220), width=5)

# Lotus petals at bottom
draw.ellipse([160, 305, 170, 315], fill=(255, 100, 100, 200))
draw.ellipse([230, 305, 240, 315], fill=(200, 100, 200, 200))

# GROWTH ARROW - Right side (white, pointing up-right)
arrow_x1, arrow_y1 = 270, 220
arrow_x2, arrow_y2 = 330, 140

# Arrow line
draw.line([(arrow_x1, arrow_y1), (arrow_x2, arrow_y2)], fill=(255, 255, 255, 255), width=4)

# Arrow head (triangle)
arrow_size = 20
angle = math.atan2(arrow_y2 - arrow_y1, arrow_x2 - arrow_x1)
arrow_left = (
    arrow_x2 - arrow_size * math.cos(angle - math.pi/6),
    arrow_y2 - arrow_size * math.sin(angle - math.pi/6)
)
arrow_right = (
    arrow_x2 - arrow_size * math.cos(angle + math.pi/6),
    arrow_y2 - arrow_size * math.sin(angle + math.pi/6)
)
draw.polygon([(arrow_x2, arrow_y2), arrow_left, arrow_right], fill=(255, 255, 255, 255))

# CHART BARS - Right side (purple to pink gradient effect)
bars = [
    (270, 240, 15, 35, (139, 0, 139, 220)),
    (295, 225, 15, 50, (150, 20, 150, 230)),
    (320, 210, 15, 65, (180, 50, 150, 240)),
    (345, 220, 15, 55, (200, 80, 150, 220))
]

for x, y, w, h, color in bars:
    # Main bar
    draw.rectangle([x, y, x+w, y+h], fill=color)
    # Pink shine on top
    draw.rectangle([x, y, x+w, y+h//3], fill=(255, 100, 200, 150))
    # Border
    draw.rectangle([x, y, x+w, y+h], outline=(255, 150, 200, 100), width=1)

# DECORATIVE SPARKLES AND DOTS
sparkles = [
    (100, 80, 3), (120, 90, 2), (130, 70, 2),
    (280, 100, 2), (310, 90, 3), (340, 110, 2),
    (90, 260, 2), (110, 280, 2),
    (310, 290, 2), (330, 320, 2),
    (150, 330, 1), (250, 340, 1)
]

for x, y, size in sparkles:
    color = (255, 100, 150, 180) if (x + y) % 2 == 0 else (255, 200, 100, 150)
    draw.ellipse([x-size, y-size, x+size, y+size], fill=color)

# Apply subtle blur for softer edges
# img = img.filter(ImageFilter.SMOOTH)

# Save the image
img.save('d:\\projects\\DBMS\\sadhna\\sadhna\\public\\sadhna-logo.png')
print("✅ Professional logo created successfully!")
print("✅ Saved to: public/sadhna-logo.png")

