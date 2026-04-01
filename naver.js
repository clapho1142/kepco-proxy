// Vercel Serverless Function — api/naver.js
// 네이버 뉴스 API를 서버에서 호출해 CORS 문제 해결

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") { res.status(200).end(); return; }

  const { query } = req.query;
  if (!query) { res.status(400).json({ error: "query 파라미터 필요" }); return; }

  const clientId     = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    res.status(500).json({ error: "네이버 API 키 미설정" }); return;
  }

  try {
    const apiUrl = "https://openapi.naver.com/v1/search/news.json"
      + "?query=" + encodeURIComponent(query) + "&display=5&sort=date";
    const response = await fetch(apiUrl, {
      headers: {
        "X-Naver-Client-Id":     clientId,
        "X-Naver-Client-Secret": clientSecret,
      },
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
