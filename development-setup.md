### Steps to run development environment
```bash
git clone git@github.com:adherelive/adherelive-web.git
cd adherelive-web
git checkout developement-env
docker compose -f docker-compose-dev.yml build node
docker compose -f docker-compose-dev.yml run node npm install
docker compose -f docker-compose-dev.yml up -d
docker compose -f docker-compose-dev.yml run node npm run migrate
docker compose -f docker-compose-dev.yml run node npm run seed
docker compose -f docker-compose-dev.yml restart
docker ps
# check the logs using below commands
docker compose -f docker-compose-dev.yml logs -f node
```