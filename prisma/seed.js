"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();
async function main() {
  const email = 'admin@rooprang.com';
  const hashed = await bcrypt.hash('Admin@123', 12);
  await prisma.admin.upsert({ where:{ email:'admin@rooprang.com'}, update:{}, create:{ name:'Roop Rang Admin', email:'admin@rooprang.com', password:hashed, role:'SUPER_ADMIN' }});
  await prisma.websiteSetting.upsert({ where:{ id:1 }, update:{}, create:{ id:1, businessName:'Roop Rang', tagline:'Luxury Cosmetics, Timeless Beauty', address:'Shop No 521, Apex Building, Madhuram Circle, Dindoli, Surat, Gujarat – 394210', email:'rangroop@gmail.com', phone:'+91 7096241594', whatsappNumber:'917096241594', facebook:'https://facebook.com/', instagram:'https://instagram.com/', youtube:'', twitter:'', googleMapEmbed:'https://maps.google.com', seoTitle:'Roop Rang - Luxury Cosmetics', seoDescription:'Premium cosmetic products' }});
  const cats = [
    {name:'Lipstick',slug:'lipstick',description:'Premium matte & glossy lipsticks'},
    {name:'Foundation',slug:'foundation',description:'Flawless base makeup'},
    {name:'Eye Makeup',slug:'eye-makeup',description:'Kajal, mascara, eyeshadow'},
    {name:'Skincare',slug:'skincare',description:'Glow & care essentials'},
    {name:'Nail Polish',slug:'nail-polish',description:'Vibrant nail colors'},
    {name:'Face Care',slug:'face-care',description:'Cleansers, toners, moisturizers'},
  ];
  for(const c of cats){ await prisma.category.upsert({ where:{ slug:c.slug }, update:{}, create:c }); }
  const lipstickCat = await prisma.category.findUnique({ where:{ slug:'lipstick' }});
  const foundationCat = await prisma.category.findUnique({ where:{ slug:'foundation' }});
  const eyeCat = await prisma.category.findUnique({ where:{ slug:'eye-makeup' }});
  const products = [
    { name:'Velvet Matte Lipstick - Ruby Red', slug:'velvet-matte-lipstick-ruby-red', sku:'RR-LIP-1001', brand:'Roop Rang', description:'Long-lasting velvet matte lipstick with intense color payoff. Enriched with Vitamin E. 12-hour stay.', shortDesc:'12hr Velvet Matte – Ruby Red', mrp:899, sellingPrice:599, discount:33, stock:45, categoryId:lipstickCat!.id, isFeatured:true, isNewArrival:true, isBestSeller:true },
    { name:'HD Flawless Foundation - Natural Beige', slug:'hd-flawless-foundation-natural-beige', sku:'RR-FND-2001', brand:'Roop Rang', description:'HD coverage foundation, lightweight, oil-control, SPF 25.', shortDesc:'HD Coverage SPF25 – Natural Beige', mrp:1299, sellingPrice:899, discount:31, stock:30, categoryId:foundationCat!.id, isFeatured:true, isBestSeller:true },
    { name:'Kajal Intense Black Waterproof', slug:'kajal-intense-black-waterproof', sku:'RR-EYE-3001', brand:'Roop Rang', description:'Smudge-proof waterproof kajal, 24hr stay.', shortDesc:'24hr Waterproof Kajal', mrp:399, sellingPrice:249, discount:38, stock:120, categoryId:eyeCat!.id, isFeatured:true, isNewArrival:true, isOffer:true },
  ];
  for(const p of products){ await prisma.product.upsert({ where:{ slug:p.slug }, update:{}, create:p as any }); }
  await prisma.offer.upsert({ where:{ slug:'diwali-glow-sale-2024'}, update:{}, create:{ name:'Diwali Glow Sale', slug:'diwali-glow-sale-2024', description:'Flat 30-50% OFF on all cosmetics. Limited time luxury beauty offer!', discount:40, discountType:'PERCENTAGE', startDate:new Date(), endDate:new Date(Date.now()+30*24*60*60*1000), status:'ACTIVE' }});
  await prisma.privacyPolicy.upsert({ where:{ slug:'privacy-policy-v1'}, update:{}, create:{ title:'Privacy Policy', slug:'privacy-policy-v1', content:'<h2>Roop Rang Privacy Policy</h2><p>We respect your privacy...</p>', version:'1.0', isActive:true }});
  await prisma.termsCondition.upsert({ where:{ slug:'terms-conditions-v1'}, update:{}, create:{ title:'Terms & Conditions', slug:'terms-conditions-v1', content:'<h2>Terms & Conditions - Roop Rang</h2><p>Welcome...</p>', version:'1.0', isActive:true }});
  console.log('✅ Seed complete! admin@rooprang.com / Admin@123');
}
main().catch(e=>{console.error(e);process.exit(1)}).finally(()=>prisma.$disconnect());
*/
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    const email = 'admin@rooprang.com';
    // 1) Create admin if not exists
    const existingAdmin = await prisma.admin.findUnique({
        where: { email },
    });
    if (!existingAdmin) {
        const hashed = await bcryptjs_1.default.hash('Admin@123', 12);
        const admin = await prisma.admin.create({
            data: {
                name: 'Super Admin',
                email,
                password: hashed,
                role: client_1.Role.SUPER_ADMIN,
                isActive: true,
            },
        });
        console.log('✅ Admin created successfully:', admin.email);
    }
    else {
        console.log('ℹ️ Admin user already exists. Skipping admin seed.');
    }
    // 2) Website settings
    await prisma.websiteSetting.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            businessName: 'Roop Rang',
            tagline: 'Luxury Cosmetics, Timeless Beauty',
            address: 'Shop No 521, Apex Building, Madhuram Circle, Dindoli, Surat, Gujarat – 394210',
            email: 'rangroop@gmail.com',
            phone: '+91 7096241594',
            whatsappNumber: '917096241594',
            facebook: 'https://facebook.com/',
            instagram: 'https://instagram.com/',
            youtube: '',
            twitter: '',
            googleMapEmbed: 'https://maps.google.com',
            seoTitle: 'Roop Rang - Luxury Cosmetics',
            seoDescription: 'Premium cosmetic products',
        },
    });
    // 3) Categories
    const cats = [
        { name: 'Lipstick', slug: 'lipstick', description: 'Premium matte & glossy lipsticks' },
        { name: 'Foundation', slug: 'foundation', description: 'Flawless base makeup' },
        { name: 'Eye Makeup', slug: 'eye-makeup', description: 'Kajal, mascara, eyeshadow' },
        { name: 'Skincare', slug: 'skincare', description: 'Glow & care essentials' },
        { name: 'Nail Polish', slug: 'nail-polish', description: 'Vibrant nail colors' },
        { name: 'Face Care', slug: 'face-care', description: 'Cleansers, toners, moisturizers' },
    ];
    for (const c of cats) {
        await prisma.category.upsert({
            where: { slug: c.slug },
            update: {},
            create: c,
        });
    }
    // 4) Get category ids
    const lipstickCat = await prisma.category.findUnique({ where: { slug: 'lipstick' } });
    const foundationCat = await prisma.category.findUnique({ where: { slug: 'foundation' } });
    const eyeCat = await prisma.category.findUnique({ where: { slug: 'eye-makeup' } });
    if (!lipstickCat || !foundationCat || !eyeCat) {
        throw new Error('Required categories not found after seeding.');
    }
    // 5) Products
    const products = [
        {
            name: 'Velvet Matte Lipstick - Ruby Red',
            slug: 'velvet-matte-lipstick-ruby-red',
            sku: 'RR-LIP-1001',
            brand: 'Roop Rang',
            description: 'Long-lasting velvet matte lipstick with intense color payoff. Enriched with Vitamin E. 12-hour stay.',
            shortDesc: '12hr Velvet Matte – Ruby Red',
            mrp: 899,
            sellingPrice: 599,
            discount: 33,
            stock: 45,
            categoryId: lipstickCat.id,
            isFeatured: true,
            isNewArrival: true,
            isBestSeller: true,
            isOffer: false,
            status: client_1.Status.ACTIVE,
        },
        {
            name: 'HD Flawless Foundation - Natural Beige',
            slug: 'hd-flawless-foundation-natural-beige',
            sku: 'RR-FND-2001',
            brand: 'Roop Rang',
            description: 'HD coverage foundation, lightweight, oil-control, SPF 25.',
            shortDesc: 'HD Coverage SPF25 – Natural Beige',
            mrp: 1299,
            sellingPrice: 899,
            discount: 31,
            stock: 30,
            categoryId: foundationCat.id,
            isFeatured: true,
            isBestSeller: true,
            isNewArrival: false,
            isOffer: false,
            status: client_1.Status.ACTIVE,
        },
        {
            name: 'Kajal Intense Black Waterproof',
            slug: 'kajal-intense-black-waterproof',
            sku: 'RR-EYE-3001',
            brand: 'Roop Rang',
            description: 'Smudge-proof waterproof kajal, 24hr stay.',
            shortDesc: '24hr Waterproof Kajal',
            mrp: 399,
            sellingPrice: 249,
            discount: 38,
            stock: 120,
            categoryId: eyeCat.id,
            isFeatured: true,
            isNewArrival: true,
            isOffer: true,
            isBestSeller: false,
            status: client_1.Status.ACTIVE,
        },
    ];
    for (const p of products) {
        await prisma.product.upsert({
            where: { slug: p.slug },
            update: {},
            create: p,
        });
    }
    // 6) Offer
    await prisma.offer.upsert({
        where: { slug: 'diwali-glow-sale-2024' },
        update: {},
        create: {
            name: 'Diwali Glow Sale',
            slug: 'diwali-glow-sale-2024',
            description: 'Flat 30-50% OFF on all cosmetics. Limited time luxury beauty offer!',
            discount: 40,
            discountType: client_1.DiscountType.PERCENTAGE,
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            status: client_1.Status.ACTIVE,
        },
    });
    // 7) Privacy Policy
    await prisma.privacyPolicy.upsert({
        where: { slug: 'privacy-policy-v1' },
        update: {},
        create: {
            title: 'Privacy Policy',
            slug: 'privacy-policy-v1',
            content: '<h2>Roop Rang Privacy Policy</h2><p>We respect your privacy...</p>',
            version: '1.0',
            isActive: true,
        },
    });
    // 8) Terms & Conditions
    await prisma.termsCondition.upsert({
        where: { slug: 'terms-conditions-v1' },
        update: {},
        create: {
            title: 'Terms & Conditions',
            slug: 'terms-conditions-v1',
            content: '<h2>Terms & Conditions - Roop Rang</h2><p>Welcome...</p>',
            version: '1.0',
            isActive: true,
        },
    });
    console.log('✅ Seed complete!');
    console.log('Admin Login: admin@rooprang.com / Admin@123');
}
main()
    .catch((e) => {
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
