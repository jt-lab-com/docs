import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
  link: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'JT-Lib - Trading Libraries',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Powerful library for creating trading strategies with support for indicators, 
        order management, market data handling, and event system.
      </>
    ),
    link: '/docs/jt-lib/core-fundamentals',
  },
  {
    title: 'JT-Trader - Trading Platform',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Full-featured trading platform with strategy tester, 
        runtime environment, and convenient interface for development and testing.
      </>
    ),
    link: '/docs/jt-trader/010-getting-started',
  },
  {
    title: 'Technical Indicators',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Built-in technical indicators system: RSI, SMA, ATR and others. 
        Easy integration with candle buffers and automatic updates.
      </>
    ),
    link: '/docs/jt-lib/technical-indicators',
  },
  {
    title: 'Order Management',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        OrdersBasket for managing trading operations with support for 
        various order types, stop-losses, and take-profits.
      </>
    ),
    link: '/docs/jt-lib/exchange-orders-basket',
  },
  {
    title: 'Market Data',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Efficient work with historical and real-time market data. 
        Candle buffering with automatic updates and caching.
      </>
    ),
    link: '/docs/jt-lib/market-data-candles',
  },
  {
    title: 'Event System',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        EventEmitter for managing events in trading strategies. 
        Subscribe to ticks, price changes, and other trading events.
      </>
    ),
    link: '/docs/jt-lib/events-system',
  },
];

function Feature({title, Svg, description, link}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
        <Link
          className={clsx("button button--secondary button--outline", styles.featureButton)}
          to={link}>
          Learn More →
        </Link>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

