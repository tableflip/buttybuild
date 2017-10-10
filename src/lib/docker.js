import docker from 'docker-remote-api'

export function createDockerClient () {
  const client = docker({
    host: '/var/run/docker.sock'
  })

  return client
}
