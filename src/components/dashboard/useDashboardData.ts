import { useCallback, useEffect, useState } from 'react';
import moment from 'moment';

import { WEATHER_CITIES } from '../../lib/constants';
import { UseDashboardDataOptions, CryptoData, WeatherData, User, Post, Todo, Comment, Album, Photo } from '../../lib/types';

export const useDashboardData = ({
  theme,
  refreshCount,
}: UseDashboardDataOptions) => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchAllData = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);

    try {
      const [
        usersRes,
        postsRes,
        todosRes,
        commentsRes,
        albumsRes,
        photosRes,
        cryptoRes,
      ] = await Promise.all([
        fetch('https://jsonplaceholder.typicode.com/users', { signal }),
        fetch('https://jsonplaceholder.typicode.com/posts', { signal }),
        fetch('https://jsonplaceholder.typicode.com/todos', { signal }),
        fetch('https://jsonplaceholder.typicode.com/comments', { signal }),
        fetch('https://jsonplaceholder.typicode.com/albums', { signal }),
        fetch('https://jsonplaceholder.typicode.com/photos', { signal }),
        fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1',
          { signal },
        ),
      ]);

      const [
        usersData,
        postsData,
        todosData,
        commentsData,
        albumsData,
        photosData,
        cryptoJson,
      ] = await Promise.all([
        usersRes.json(),
        postsRes.json(),
        todosRes.json(),
        commentsRes.json(),
        albumsRes.json(),
        photosRes.json(),
        cryptoRes.json(),
      ]);

      if (signal?.aborted) {
        return;
      }

      const weatherResults = await Promise.all(
        WEATHER_CITIES.map(async (city) => {
          const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true`,
            { signal },
          );
          const weatherJson = await weatherResponse.json();
          return { ...city, weather: weatherJson.current_weather };
        }),
      );

      if (signal?.aborted) {
        return;
      }

      setUsers(usersData);
      setPosts(postsData);
      setTodos(todosData);
      setComments(commentsData);
      setAlbums(albumsData);
      setPhotos(photosData);
      setCryptoData(cryptoJson);
      setWeatherData(weatherResults);
      setLastUpdated(moment().format('HH:mm:ss'));
      setLoading(false);
    } catch (err: unknown) {
      if ((err as Error)?.name === 'AbortError') {
        return;
      }

      setError('Something went wrong');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchAllData(controller.signal);

    return () => {
      controller.abort();
    };
  }, [theme, refreshCount, fetchAllData]);

  useEffect(() => {
    const pollTimer = window.setInterval(async () => {
      try {
        await fetch('https://jsonplaceholder.typicode.com/posts?_limit=1');
      } catch (_error) {
        // Keep existing silent polling behavior.
      }
    }, 3000);

    return () => {
      window.clearInterval(pollTimer);
    };
  }, []);

  return {
    cryptoData,
    weatherData,
    users,
    posts,
    todos,
    comments,
    albums,
    photos,
    loading,
    error,
    lastUpdated,
    setTodos,
  };
};
