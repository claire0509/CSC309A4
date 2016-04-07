from locust import HttpLocust, TaskSet, task

# user credentials
username = 'abc'
password = '123'

# user auth
arg_u_a = 'Locust.io'
arg_u_b = '1234'

# post desc
arg_p_a = 'Test location'
arg_p_b = 'Test description'
arg_p_c = '100'
arg_p_d = '10'
arg_p_e = '10'
arg_p_f = '1000'
arg_p_g = 'April 1 2016'


class UserTask(TaskSet):

	def on_start(l):
		l.client.post("/auth/signup", {
			"username": arg_u_a,
			"password": arg_u_b
		})
	
	@task(1)
	def login(l):
		l.client.post("/auth/login", {
			"username": arg_u_a, 
			"password": arg_u_b})

	@task(1)
	def index(l):
		l.client.get("/")

	@task(1)
	def post(l):
		l.client.post("/api/posts", {
			"location": arg_p_a, 
			"description": arg_p_b, 
			"tcommute": arg_p_c, 
			"nroom": arg_p_d, 
			"nbathroom": arg_p_e, 
			"price": arg_p_f, 
			"created_by": arg_u_a})

	@task(1)
	def posts(l):
		l.client.get("/api/users")
		 

class APITask(HttpLocust):

	task_set = UserTask
	min_wait = 5 * 1000
	max_wait = 15 * 1000
	# website address
	host = "http://localhost:3000"

