'use strict';
var writedata = require('./writedata');
var shell = require('shelljs');
var _random = require('randgen');
_random.uniform = Math.random ;
function grid(space) {
    var dimensions = space.dimensions,
    n_points = space.n_points;

    var intervals = space.intervals;
    var grid_points=[],a,b,length,N;
    if (n_points.length !==dimensions ||intervals !== dimensions) {
      return ;
    }
    for (var i = 0; i < dimensions; i++) {
      grid_points[i] = [];
      a = intervals[i][0];
      b =intervals[i][1];
      N=n_points[i];
      length = (b-a)/N;
      for (var j= 0; j < space.n_points; j++) {
      grid_points[i][j]= a+(j+0.5)*length;
      }
    }
    return grid_points;
}

function random(dist, params) {
  return _random[dist](params[0],params[1]);
}
function path_Graphic(walk) {
  shell.rm('./walk_data.dat');
  var i,j,step;
  var space  = walk.space;
  var _grid = grid(space),
  initial_point = walk.initial_point,
  p=initial_point,
  P=[];
  for ( j = 0; i < space.dimensions; i++) {
    P[i]=_grid[p[i]];
  }
  writedata('walk_data.dat',P);
  shell.exec('gnuplot liveplot.gnu', {async:true});
  var N=walk.Num;
  var _path = [];
  _path[0]=P;
  for ( i = 0; i < N; i++) {
    for ( j = 1; j < space.dimensions; j++) {
      step  =(random(walk.distribution,walk.params)-walk.params[2])<=0 ? 1:-1;
      p[j]= p[j]+ step;
      P[j]=_grid[p[j]];
    }
    writedata('walk_data.dat',P);
    _path.push(P);
  }
  return _path;
}
module.exports = path_Graphic;

path_Graphic(
  {
    initial_point:[5,89],
    params : [0,0,0.2],
    distribution : 'uniform',
    space : {dimensions:2,
            n_points: [1000,1000],
            intervals: [ [1,9],[2,17]]}
});
