import React from 'react';
import { Link, useRoutes } from 'raviger'

import { HomePage } from './HomePage';
import { WheelPage } from './WheelPage';
import { useSubscribe } from 'meteor/react-meteor-data';

const routes = {
  '/': () => <HomePage />,
  '/wheels/:wheelId': (props: { wheelId: string }) => <WheelPage wheelId={props.wheelId} />
}

export function App() {
  const isLoading = useSubscribe("wheel-list");

  const route = useRoutes(routes);

  if (isLoading()) {
    return <div>Loading wheels...</div>;
  }

  return (
    <div>
      <h1><Link href="/">spinny wheel of doing things THEN checking them off ✅🤸🎡🍂</Link></h1>
      {route}
    </div>
  );
}
