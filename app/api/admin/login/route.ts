import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  console.log('========== LOGIN API ==========');
  
  try {
    const { password } = await request.json();
    console.log('Пароль из запроса:', password);
    
    // Проверяем пароль
    if (password === process.env.ADMIN_PASSWORD) {
      console.log('✅ Пароль верный');
      
      // Создаем ответ
      const response = NextResponse.json({ 
        success: true,
        message: 'Вход выполнен' 
      });
      
      // Устанавливаем куку через response.cookies.set()
      response.cookies.set('admin_token', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 7 дней
        path: '/',
      });
      
      return response;
    }
    
    console.log('❌ Пароль неверный');
    return NextResponse.json(
      { error: 'Неверный пароль' },
      { status: 401 }
    );
    
  } catch (error) {
    console.error('❌ Ошибка:', error);
    return NextResponse.json(
      { error: 'Ошибка при входе' },
      { status: 500 }
    );
  }
}