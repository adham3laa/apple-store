const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const iphone16Pro = await prisma.product.create({
    data: {
      name: 'iPhone 16 Pro',
      category: 'iPhone',
      description: 'Grade 5 Titanium. A18 Pro chip. Camera Control.',
      basePrice: 999,
      variants: {
        create: [
          { type: 'Color', name: 'Desert Titanium', priceModifier: 0 },
          { type: 'Color', name: 'Natural Titanium', priceModifier: 0 },
          { type: 'Color', name: 'White Titanium', priceModifier: 0 },
          { type: 'Color', name: 'Black Titanium', priceModifier: 0 },
          { type: 'Storage', name: '128GB', priceModifier: 0 },
          { type: 'Storage', name: '256GB', priceModifier: 100 },
          { type: 'Storage', name: '512GB', priceModifier: 300 },
          { type: 'Storage', name: '1TB', priceModifier: 500 },
          { type: 'Case', name: 'Direct Chassis', priceModifier: 0 },
          { type: 'Lighting', name: 'Studio Light', priceModifier: 0 },
        ]
      },
      media: {
        create: [
          { type: 'PosterBase', url: 'https://www.apple.com/newsroom/images/2024/09/apple-debuts-iphone-16-pro-and-iphone-16-pro-max/article/Apple-iPhone-16-Pro-hero-240909_inline.jpg.large_2x.jpg' },
          { type: 'PosterColor', url: 'https://www.apple.com/newsroom/images/2024/09/apple-debuts-iphone-16-pro-and-iphone-16-pro-max/article/Apple-iPhone-16-Pro-finish-lineup-240909_big.jpg.large_2x.jpg' },
          { type: 'PosterStorage', url: 'https://www.apple.com/newsroom/images/2024/09/apple-debuts-iphone-16-pro-and-iphone-16-pro-max/article/Apple-iPhone-16-Pro-hero-240909_inline.jpg.large_2x.jpg' },
          { type: 'PosterCaseState', url: 'https://www.apple.com/newsroom/images/2024/09/apple-debuts-iphone-16-pro-and-iphone-16-pro-max/article/Apple-iPhone-16-Pro-Camera-Control-ChatGPT-240909_inline.jpg.large_2x.jpg' },
          { type: 'PosterLighting', url: 'https://www.apple.com/newsroom/images/2024/09/apple-debuts-iphone-16-pro-and-iphone-16-pro-max/article/Apple-iPhone-16-Pro-camera-system-240909_inline.jpg.large_2x.jpg' },
          { type: 'VideoColorFwd', url: 'https://www.apple.com/newsroom/videos/videos-2024/autoplay/2024/09/apple-iphone-16-pro-light-and-durable-upgraded-design/large_2x.mp4' },
          { type: 'VideoColorRev', url: 'https://www.apple.com/newsroom/videos/videos-2024/autoplay/2024/09/apple-iphone-16-pro-light-and-durable-upgraded-design/large_2x.mp4' },
          { type: 'VideoStorageFwd', url: 'https://www.apple.com/newsroom/videos/videos-2024/autoplay/2024/09/apple-iphone-16-pro-gaming-death-stranding/large_2x.mp4' },
          { type: 'VideoStorageRev', url: 'https://www.apple.com/newsroom/videos/videos-2024/autoplay/2024/09/apple-iphone-16-pro-gaming-death-stranding/large_2x.mp4' },
          { type: 'VideoCaseStateFwd', url: 'https://www.apple.com/newsroom/videos/videos-2024/autoplay/2024/09/apple-iphone-16-pro-camera-control/large_2x.mp4' },
          { type: 'VideoCaseStateRev', url: 'https://www.apple.com/newsroom/videos/videos-2024/autoplay/2024/09/apple-iphone-16-pro-camera-control/large_2x.mp4' },
          { type: 'VideoLightingFwd', url: 'https://www.apple.com/newsroom/videos/videos-2024/autoplay/2024/09/apple-iphone-16-pro-4k120-fps-video-recording-dolby-vision/large_2x.mp4' },
          { type: 'VideoLightingRev', url: 'https://www.apple.com/newsroom/videos/videos-2024/autoplay/2024/09/apple-iphone-16-pro-4k120-fps-video-recording-dolby-vision/large_2x.mp4' },
        ]
      }
    }
  })

  console.log('Database seeded with iPhone 16 Pro', iphone16Pro.id)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
