import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const slug = searchParams.get('slug');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    const includeCategories = searchParams.get('includeCategories') === 'true';

    // Single product by slug
    if (slug) {
      const product = await db.product.findUnique({
        where: { slug },
        include: { category: true },
      });
      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      return NextResponse.json({ product });
    }

    // Featured products
    if (featured === 'true') {
      const products = await db.product.findMany({
        where: { featured: true },
        include: { category: true },
        orderBy: { id: 'asc' },
      });
      return NextResponse.json({ products, pagination: { page: 1, limit: products.length, total: products.length, totalPages: 1 } });
    }

    // Categories list
    if (includeCategories) {
      const categories = await db.category.findMany({
        include: { _count: { select: { products: true } } },
        orderBy: { name: 'asc' },
      });
      return NextResponse.json({ categories });
    }

    // Build where clause
    const where: Record<string, unknown> = {};
    if (category) {
      where.category = { slug: category };
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { sku: { contains: search } },
      ];
    }

    const total = await db.product.count({ where });
    const totalPages = Math.ceil(total / limit);
    const products = await db.product.findMany({
      where,
      include: { category: true },
      orderBy: { id: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({
      products,
      pagination: { page, limit, total, totalPages },
    });
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
