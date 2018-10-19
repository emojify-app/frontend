build_website:
	yarn run build

build_docker:
	docker build -t nicholasjackson/emojify-website:latest .

run_docker:
	docker run -it -p 5000:5000 nicholasjackson/emojify-website

push_docker:
	docker push nicholasjackson/emojify-website:latest

build_and_push: build_website build_docker push_docker
