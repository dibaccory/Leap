export const getUrl = server => `http://${server.address().address}:${server.address().port}`;
export const bindCtx = (ctx) => (req, res, next) => {
  req.ctx = ctx;
  next();
};

export const renderFullPage = (html, initialState) => (
`
  <!doctype html>
  <html lang="en">
    <head>
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" />
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css" />
      <link rel="icon" href="./favicon.ico" type="image/x-icon" />
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      <title>Leap</title>
    </head>
    <body>
      <div id="root">${html}</div>
      <script>
        window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
      </script>
      <script src="/dist/main.bundle.js"></script>
    </body>
  </html>
`
);
