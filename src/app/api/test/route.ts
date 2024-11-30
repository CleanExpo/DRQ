import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../config/database';
import { TestModel, ITest } from '../../../models/Test';
import { logger } from '../../../utils/logger';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') as ITest['status'] | null;
    const name = searchParams.get('name');

    let tests;
    if (status === 'active') {
      tests = await TestModel.findActive();
    } else if (name) {
      tests = await TestModel.findAll({ name: name });
    } else {
      tests = await TestModel.findAll();
    }

    return NextResponse.json({
      success: true,
      data: tests,
      count: tests.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('GET /api/test error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { name, metadata } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request',
          details: 'Name is required and must be a string'
        },
        { status: 400 }
      );
    }

    const test = await TestModel.create({
      name,
      metadata: metadata || {},
      date: new Date()
    });

    return NextResponse.json({
      success: true,
      data: test,
      timestamp: new Date().toISOString()
    }, { status: 201 });
  } catch (error) {
    logger.error('POST /api/test error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { id, ...update } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request',
          details: 'ID is required'
        },
        { status: 400 }
      );
    }

    const updatedTest = await TestModel.updateById(id, update);
    if (!updatedTest) {
      return NextResponse.json(
        {
          success: false,
          error: 'Not Found',
          details: 'Test document not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedTest,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('PUT /api/test error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectToDatabase();

    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request',
          details: 'ID is required'
        },
        { status: 400 }
      );
    }

    const deleted = await TestModel.deleteById(id);
    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: 'Not Found',
          details: 'Test document not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Test document deleted successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('DELETE /api/test error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}
