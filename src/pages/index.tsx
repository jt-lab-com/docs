import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Start Learning - 5min ⏱️
          </Link>
          <Link
            className="button button--outline button--secondary button--lg"
            to="/docs/quick-start">
            Quick Start 🚀
          </Link>
        </div>
      </div>
    </header>
  );
}

function QuickLinks() {
  return (
    <section className="padding-vert--xl">
      <div className="container">
        <div className="row">
          <div className="col col--12">
            <div className="text--center margin-bottom--lg">
              <Heading as="h2">Quick Links</Heading>
              <p>Start with the basics or jump to specific sections</p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col col--6">
            <div className="card">
              <div className="card__header">
                <h3>🚀 Quick Start</h3>
              </div>
              <div className="card__body">
                <p>Install and configure JT-Lib in 5 minutes</p>
                <Link className="button button--primary" to="/docs/quick-start">
                  Start Now
                </Link>
              </div>
            </div>
          </div>
          <div className="col col--6">
            <div className="card">
              <div className="card__header">
                <h3>📚 Code Examples</h3>
              </div>
              <div className="card__body">
                <p>Ready-made trading strategy and indicator examples</p>
                <Link className="button button--primary" to="/docs/examples-guide">
                  View Examples
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="row margin-top--lg">
          <div className="col col--4">
            <div className="card">
              <div className="card__header">
                <h3>⚡ JT-Lib</h3>
              </div>
              <div className="card__body">
                <p>Trading libraries and API</p>
                <div className="button-group">
                  <Link className="button button--secondary" to="/docs/jt-lib/core-fundamentals">
                    Documentation
                  </Link>
                  <Link className="button button--outline button--secondary" href="https://github.com/jt-lab-com/jt-lib" target="_blank">
                    GitHub
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="col col--4">
            <div className="card">
              <div className="card__header">
                <h3>🖥️ JT-Trader</h3>
              </div>
              <div className="card__body">
                <p>Trading platform and interface</p>
                <div className="button-group">
                  <Link className="button button--secondary" to="/docs/jt-trader/010-getting-started">
                    Documentation
                  </Link>
                  <Link className="button button--outline button--secondary" href="https://github.com/jt-lab-com/jt-trader" target="_blank">
                    GitHub
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="col col--4">
            <div className="card">
              <div className="card__header">
                <h3>🌐 JT-Lab</h3>
              </div>
              <div className="card__body">
                <p>Official website and resources</p>
                <div className="button-group">
                  <Link className="button button--primary" href="https://jt-lab.com" target="_blank">
                    Official Website
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Complete documentation for JT-Lib and JT-Trader - libraries for creating trading strategies and algorithmic trading in JavaScript">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <QuickLinks />
      </main>
    </Layout>
  );
}