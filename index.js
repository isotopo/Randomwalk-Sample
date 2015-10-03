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
    if (n_points.length !==dimensions ||intervals.length !== dimensions) {
      return ;
    }

    for (var i = 0; i < dimensions; i++) {
      grid_points[i] = [];
      a = intervals[i][0];
      b =intervals[i][1];
      N=n_points[i];
      length = (b-a)/N;

      for (var j= 0; j < n_points[i]; j++) {
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
  for ( j = 0; j < space.dimensions; j++) {
    P[j]=_grid[j][p[j]];
  }

  writedata('./walk_data.dat',[P]);
  //shell.exec('gnuplot liveplot.gnu', {async:true});
  var N=walk.Num,jump;
  var _path = [];
  _path[0]=P;
  for ( i = 0; i < N; i++) {
    for ( j = 0; j < space.dimensions; j++) {

      if (p[j]=== space.n_points[j]) {
          p[j]= p[j]-1;
      } else if(p[j]===0) {
          p[j]= p[j]+1;
      } else {
        jump = random(walk.distribution,walk.params);
        step  =(jump-walk.params[2])<=0 ? -1:1;
          p[j]= p[j]+ step;
      }
      P[j]=_grid[j][p[j]];
    }
      writedata('./walk_data.dat',[P]);
    _path.push(P);
  }
  return _path;
}
module.exports = path_Graphic;

path_Graphic(
  {Num:20000,
    initial_point:[445,488],
    params : [0,0,0.6],
    distribution : 'uniform',
    space : {dimensions:2,
            n_points: [1000,1000],
            intervals: [ [0,10],[0,10]]}
});
