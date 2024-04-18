const axios = require('axios');

const parseHistory = async (data) => {
    let res = [];
    await data['t'].forEach((d, index) => {
        res.push({
            'date': new Date(d * 1000),
            'price': data['c'][index]
        });
    });

    return res;
  }

const _getRoundData = async (symbol, onDate, backRange) => {
    const today = new Date(onDate);
    const past = new Date(today);
    const from = Math.floor(past.setDate(today.getDate() - parseInt(backRange, 10)) / 1000);
    const to = Math.floor(today.getTime() / 1000);
  
    const url = `https://dchart-api.vndirect.com.vn/dchart/history?resolution=D&symbol=${symbol}&from=${from}&to=${to}`;
    console.log(url);
    const response = await axios.get(url);
    return {
      past: past.toLocaleDateString(),
      response: response.data
    };
  }
  
const _getPriceHistory = async (symbol, date, days) => {
    let result = [];
    let rounds;
    const rest = days % 1000;
    let range = 1000
    if (days < 1000) {
      rounds = 1;
      range = days;
    } else {
      rounds = Math.floor(days / 1000);
    }
  
    let today = date === 'today' ? new Date() : new Date(date);
    for (let i = 0; i < rounds; i++) {
      const { past, response } = await _getRoundData(symbol, today, range);
      console.log(`${today.toLocaleDateString()} to ${past}`);
      const res = await parseHistory(response);
      result = [...res, ...result];
  
      today = new Date(past);
      today.setDate(today.getDate() - 1);
  
      if (range !== rest && days > 1000 && i === rounds - 1) {
        range = rest;
        rounds++;
      }
    }
  
    console.log(result);
    return result;
}



// _getPriceHistory('VNINDEX', '2017-08-01', 1000);