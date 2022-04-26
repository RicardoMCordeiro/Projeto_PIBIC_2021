module.exports = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/companhias',
        permanent: true,
      },
    ]
  },
}
