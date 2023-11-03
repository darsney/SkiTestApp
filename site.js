var id = "1uFKv6KgbCks2G3Ugzz4_P0Fd2QfPtNeCfQqkvNEDYjQ";
var gid = 0;
window.googleDocCallback = function () {
  return true;
};
var url =
  "https://docs.google.com/spreadsheets/d/" +
  id +
  "/gviz/tq?tqx=out:json&tq&gid=" +
  gid +
  "&callback=googleDocCallback";
var proxyUrl = `https://cors-proxy.io/${url}`;
$.get(proxyUrl, (d) => {
  debugger;
});
