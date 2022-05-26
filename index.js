const http = require('http');
const url = require('url');
const fs = require('fs');
const replaceTemplate = require('./modules/replaceTemplate');
const slugify = require('slugify');
const { setDefaultResultOrder } = require('dns/promises');

//Reading data

const data = fs.readFileSync(`${__dirname}/data.json`, 'utf-8');
const dataObj = JSON.parse(data);
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);

const slugs = dataObj.map((item) => slugify(item.productName), { lower: true });
console.log(slugs);

//Create a Server Instance

const server = http.createServer((req, res) => {
  const pathName = req.url;

  const { query, pathname } = url.parse(req.url, true);
  if (pathname === '/overview' || pathname === '/') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);
  } else if (pathname === '/product') {
    const product = dataObj[query.id];
    console.log(query.id);
    let output = replaceTemplate(tempProduct, product);
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    res.end(output);
  } else if (pathname === '/api') {
    res.writeHead(202, {
      ContentType: 'application/json',
    });
    res.end(data);
  } else {
    res.writeHead(404, {
      ContentType: 'text/html',
    });
    res.end('<h1>Page Not Found</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('listening on port 8000');
});
