// CloudFront Function (viewer-request) for the PREVIEW distribution.
//
// Each PR is served at pr-<n>.preview.alvarado.dev while its build lives under
// the S3 key prefix "pr-<n>/". This function derives the prefix from the Host
// header and rewrites the request URI accordingly. Route-like requests (no file
// extension in the final path segment) fall back to the prefix's index.html so
// client-side routing (react-router BrowserRouter) works on deep links/refresh.
//
// Runtime: cloudfront-js-2.0. Keep to simple ES (no String.includes on some
// builds) — indexOf is used deliberately.
function handler(event) {
  var request = event.request;
  var host = request.headers.host.value; // e.g. "pr-123.preview.alvarado.dev"
  var label = host.split('.')[0];        // e.g. "pr-123"
  var uri = request.uri;                 // e.g. "/", "/noah", "/assets/app.js"

  var lastSlash = uri.lastIndexOf('/');
  var lastSegment = uri.substring(lastSlash + 1);
  var isFile = lastSegment.indexOf('.') !== -1;

  if (!isFile) {
    // Route request (or "/") -> SPA shell for this PR.
    request.uri = '/' + label + '/index.html';
  } else {
    // Asset request -> real object under the PR prefix.
    request.uri = '/' + label + uri;
  }

  return request;
}
