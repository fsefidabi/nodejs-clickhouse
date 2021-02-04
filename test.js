const asyncTimedCargo = require('async-timed-cargo');

const cargo = asyncTimedCargo(function(tasks, callback) {

  // the tasks array will be [1, 2, 3]
  // this will be called after 1000ms, as number of items (3) is smaller than payload (10)
  callback(tasks);

}, 10, 1000);

cargo.push(1);
cargo.push(2);
cargo.push(3, function(tasks) {
  console.log(tasks)
  console.log('done')
});