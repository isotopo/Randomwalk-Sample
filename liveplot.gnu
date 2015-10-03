
set xrange [0:10]
set yrange [0,10]
plot "walk_data.dat" using 1:2 with lines
pause 0.1
reread
