# Manual Deployment - Meeting Desk API

## 1. Build Docker Image (Linux AMD64)

```bash
docker buildx build \
  --platform linux/amd64 \
  --load \
  -t meetingdesk-api:latest .
```

---

## 2. Tag Docker Image

```bash
docker tag meetingdesk-api:latest \
950884909240.dkr.ecr.ap-south-1.amazonaws.com/meetingdesk-api:latest
```

---

## 3. Login to Amazon ECR (Run only if login has expired)

```bash
aws ecr get-login-password --region ap-south-1 | \
docker login \
--username AWS \
--password-stdin 950884909240.dkr.ecr.ap-south-1.amazonaws.com
```

---

## 4. Push Image to ECR

```bash
docker push \
950884909240.dkr.ecr.ap-south-1.amazonaws.com/meetingdesk-api:latest
```

---

## 5. SSH into Production Server

```bash
ssh -i /path/to/your-key.pem ubuntu@3.7.108.255
```

---

## 6. Login to Amazon ECR (EC2)

Use `sudo docker login` so credentials are stored for root. `sudo docker pull` / `sudo docker run` ignore the ubuntu user's `~/.docker/config.json`.

```bash
aws ecr get-login-password --region ap-south-1 | \
sudo docker login \
--username AWS \
--password-stdin 950884909240.dkr.ecr.ap-south-1.amazonaws.com
```

---

## 7. Pull Latest Docker Image

```bash
sudo docker pull \
950884909240.dkr.ecr.ap-south-1.amazonaws.com/meetingdesk-api:latest
```

---

## 8. Stop Existing Container

```bash
sudo docker stop meetingdesk-api
```

---

## 9. Remove Existing Container

```bash
sudo docker rm meetingdesk-api
```

---

## 10. Start New Container

```bash
sudo docker run -d \
  --name meetingdesk-api \
  --restart unless-stopped \
  --env-file /opt/meetingdesk/backend/.env \
  -p 3000:3000 \
  950884909240.dkr.ecr.ap-south-1.amazonaws.com/meetingdesk-api:latest
```

---

## 11. Verify Running Containers

```bash
sudo docker ps
```

---

## 12. Check Application Logs

```bash
sudo docker logs --tail 100 meetingdesk-api
```

---

## 13. Verify Local Health Endpoint

```bash
curl http://localhost:3000/health
```

Expected Response:

```json
{"status":"ok"}
```

---

## 14. Verify Production Health Endpoint

```bash
curl https://api.meetingdesk.in/health
```

Expected Response:

```json
{"status":"ok"}
```

---

## 15. Verify Nginx Configuration (If Modified)

```bash
sudo nginx -t
```

---

## 16. Reload Nginx (If Configuration Changed)

```bash
sudo systemctl reload nginx
```

---

## 17. Check Nginx Logs (Optional)

Access Logs

```bash
sudo tail -f /var/log/nginx/access.log
```

Error Logs

```bash
sudo tail -f /var/log/nginx/error.log
```

---

## 18. Docker Cleanup (Optional)

Remove unused images

```bash
sudo docker image prune -a -f
```

Check Docker disk usage

```bash
sudo docker system df
```

---

# Deployment Flow

```
Local Development
        │
        ▼
Build Docker Image
        │
        ▼
Push Image to Amazon ECR
        │
        ▼
SSH into EC2
        │
        ▼
Pull Latest Image
        │
        ▼
Stop Existing Container
        │
        ▼
Remove Existing Container
        │
        ▼
Start New Container
        │
        ▼
Verify Logs
        │
        ▼
Verify Health Endpoint
        │
        ▼
Production Live 🚀
```





Name	Email	Password
Krishan Kumar
krishan.kumar@virtualedge.in
Krishukrishan1211@
Akash Rao
akash.rao@virtualedge.in
Akash@2026
Akash Chikkalli
akash.chikkalli@virtualedge.in
Akashchikkalli@2026