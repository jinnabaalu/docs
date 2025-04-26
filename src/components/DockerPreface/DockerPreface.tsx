import React from 'react';

const DockerPreface: React.FC = () => {
  return (
    <div className="docker-preface">
      <h2>Preface</h2>
      <p>
        This post assumes that you have some basic understanding of Docker/Podman,
        Docker Compose, and the key components used in the Docker ecosystem. Get up to speed,
        with the{' '}
        <a href="https://docs.docker.com/get-started/#prepare-your-docker-environment">
          Prepare Your Container Environment with Docker
        </a>{' '}
        or{' '}
        <a href="https://podman.io/docs/installation">Podman</a> section of Docker docs.
      </p>
      <ol>
        <li>
          Install{' '}
          <a href="https://docs.docker.com/install/linux/docker-ce/ubuntu/">Docker</a> or{' '}
          <a href="https://podman.io/docs/installation">Podman</a>
        </li>
        <li>
          Install{' '}
          <a href="https://docs.docker.com/compose/install/">Docker Compose</a>
        </li>
      </ol>
    </div>
  );
};

export default DockerPreface;
