import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const IMAGE_MAP: Record<string, string> = {
  'a-roma-double-chaal': '/images/products/a-roma-double-chaal.jpg',
  'one-star-jh': '/images/products/domestic-sewing-machine.jpg',
  'one-star-new-model': '/images/products/one-star-new-model.jpg',
  'rocket-565-multifunction-machine': '/images/products/rocket-565-multifunction.jpg',
  'rocket-double-chaal': '/images/products/domestic-sewing-machine.jpg',
  'rocket-link-motion': '/images/products/rocket-link-motion.jpg',
  'rocket-link-motion-super-model': '/images/products/rocket-link-motion.jpg',
  'rocket-new-model': '/images/products/domestic-sewing-machine.jpg',
  'rocket-pfaff-model': '/images/products/domestic-sewing-machine.jpg',
  'sattar-double-chaal': '/images/products/domestic-sewing-machine.jpg',
  'rocket-overlock-and-pico-machine-747': '/images/products/rocket-overlock-747.jpg',
  'rocket-industrial-machine-a5': '/images/products/industrial-machine.jpg',
  'rocket-industrial-machine-a8': '/images/products/rocket-industrial-a8.jpg',
  'rocket-industrial-machine-h8': '/images/products/industrial-machine.jpg',
  'rocket-industrial-machine-8700d': '/images/products/industrial-machine.jpg',
  'one-star-sewing-machine-motor': '/images/products/rocket-motor-hf71.jpg',
  'one-star-sewing-needles': '/images/products/sewing-needles.jpg',
  'rocket-sewing-needles': '/images/products/sewing-needles.jpg',
  'rocket-industrial-needles': '/images/products/needles-motors.jpg',
  'rocket-sewing-machine-motor-150-watt': '/images/products/rocket-motor-hf71.jpg',
  'rocket-hf-67-150-watt': '/images/products/rocket-motor-hf71.jpg',
  'rocket-hf-69-150-watt': '/images/products/rocket-motor-hf71.jpg',
  'rocket-hf-71-250-watt': '/images/products/rocket-motor-hf71.jpg',
  'rocket-hf-69-180-watt': '/images/products/rocket-motor-hf71.jpg',
  'cover-farmeeka': '/images/products/accessories.jpg',
  'cover-farmeeka-sp': '/images/products/accessories.jpg',
  'cover-farmeeka-sp-grey': '/images/products/accessories.jpg',
  'cover-iron-steel': '/images/products/accessories.jpg',
  'cover-wood-dark-brown': '/images/products/accessories.jpg',
  'cover-wood-light-brown': '/images/products/accessories.jpg',
  'led-light': '/images/products/accessories.jpg',
};

async function main() {
  for (const [slug, imageUrl] of Object.entries(IMAGE_MAP)) {
    await prisma.product.updateMany({
      where: { slug },
      data: { imageUrl },
    });
    console.log(`Updated: ${slug}`);
  }
  console.log('Done! All product images updated to local paths.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
