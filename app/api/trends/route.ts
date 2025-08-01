import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const keyword = req.nextUrl.searchParams.get('keyword');
        let queries = []
        if (keyword && keyword?.split(',').length > 1) {
            queries = keyword?.split(',')
        } else {
            queries = [keyword]
        }
        const results = [];

        function sleep(ms: number) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        for (const query of queries) {
            if (!query || query.trim() === '') continue;

            try {
                const response = await fetch(`https://pulsey-python-script.onrender.com/trends?keyword=${encodeURIComponent(query.trim())}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                results.push({
                    keyword: query.trim(),
                    data: data
                });

            } catch (err) {
                console.error(`Error processing keyword "${query}":`, err);
                results.push({
                    keyword: query.trim(),
                    error: 'Failed to process this keyword'
                });
            }
        }

        if (queries.length === 1) {
            const result = results[0];
            if (result.error) {
                return NextResponse.json({ error: result.error, success: false }, { status: 500 });
            }
            return NextResponse.json({ queries: result.data, success: true }, { status: 200 });
        }

        return NextResponse.json({ queries: results, success: true }, { status: 200 });
    } catch (error) {
        console.error('Error calling trends service:', error);
        return NextResponse.json({ error: 'Service execution failed', success: false }, { status: 500 });
    }
}
