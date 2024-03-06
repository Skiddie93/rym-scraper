import fetch from "node-fetch";
import 'dotenv/config'

export const getToken = async (test) => {


  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET


  const params = {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
  };

  const req = await fetch("https://accounts.spotify.com/api/token", params);
  const data = await req.json();

  const accessToken = data.access_token;


  return accessToken;
};

export const getAlbumBatch = async (token, id) => {
  const req = await fetch(`https://api.spotify.com/v1/albums/?ids=${id}`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  })

  let item = await req.json();
  console.log(item);
  if(item.error) return item

  const makeData = item.albums.map((albums) => {
    return {
      id: albums.id,
      external_urls: { spotify: albums.external_urls?.spotify },
      name: albums.name,
      images: albums.images,
      release_date: albums.release_date,
      artists: albums.artists,
      href: albums.href,
    };
  });

  return makeData;
};
