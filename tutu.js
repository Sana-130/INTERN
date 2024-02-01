const {detectClones} = require("jscpd");

(async () => {
  const clones = await detectClones({
    path: [
      __dirname + '/downloads/ex-FastHub'
    ],
    silent: true
  });
  console.log(clones);
})()