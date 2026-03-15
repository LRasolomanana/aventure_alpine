const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'www.google.com', // On ajoute ce domaine ici
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;