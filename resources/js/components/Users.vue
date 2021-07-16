<template>
  <div class="container">
    <div class="row" v-if="$get.isAdmin()">
      <div class="col-md-12">
        <div class="card mt-5">
          <div class="card-header">
            <h3 class="card-title">Users List</h3>

            <div class="card-tools">
              <!-- Button trigger modal -->
              <button class="btn btn-success" @click="newUser">
                Add New <i class="fa fa-user-plus"></i>
              </button>
              <!-- Modal -->
              <div
                class="modal fade"
                id="addNewUser"
                tabindex="-1"
                aria-labelledby="addNewUserLabel"
                aria-hidden="true"
              >
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="addNewUserLabel">
                        {{ editMode ? "Edit User" : "Add New User" }}
                      </h5>
                      <button
                        type="button"
                        class="close"
                        data-dismiss="modal"
                        aria-label="Close"
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <form
                      @submit.prevent="editMode ? updateUser() : createUser()"
                    >
                      <div class="modal-body">
                        <div class="form-group">
                          <input
                            class="form-control"
                            v-model="form.name"
                            type="text"
                            name="name"
                            placeholder="Username"
                            :class="{ 'is-invalid': form.errors.has('name') }"
                          />
                          <div
                            v-if="form.errors.has('name')"
                            v-html="form.errors.get('name')"
                            class="text-danger"
                          />
                        </div>
                        <div class="form-group">
                          <input
                            class="form-control"
                            v-model="form.email"
                            type="email"
                            name="email"
                            placeholder="Email"
                          />
                          <div
                            v-if="form.errors.has('email')"
                            v-html="form.errors.get('email')"
                            class="text-danger"
                          />
                        </div>
                        <div class="form-group">
                          <textarea
                            name="bio"
                            v-model="form.bio"
                            class="form-control"
                            id="bio"
                            placeholder="Short bio for user (optional)"
                            
                          ></textarea>
                          <div
                            v-if="form.errors.has('bio')"
                            v-html="form.errors.get('bio')"
                            class="text-danger"
                          />
                        </div>
                        <div class="form-group">
                          <select name="type" id="type" v-model="form.type" class="form-control">
                            <option value="">Select User Type</option>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                          </select>
                          <div
                            v-if="form.errors.has('type')"
                            v-html="form.errors.get('type')"
                            class="text-danger"
                          />
                        </div>
                        <div class="form-group">
                          <input
                            class="form-control"
                            v-model="form.password"
                            type="password"
                            name="password"
                            placeholder="Password"
                            autocomplete="off"
                          />
                          <div
                            v-if="form.errors.has('password') & !editMode"
                            v-html="form.errors.get('password')"
                            class="text-danger"
                          />
                        </div>
                      </div>
                      <div class="modal-footer">
                        <button
                          type="button"
                          class="btn btn-danger"
                          data-dismiss="modal"
                        >
                          Close
                        </button>
                        <button type="submit" class="btn btn-primary">
                          {{ editMode ? "Edit" : "Create" }}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- /.card-header -->
          <div class="card-body table-responsive p-0">
            <table class="table table-hover text-nowrap">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Resgistered At</th>
                  <th>Type</th>
                  <th>Modify</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users.data" :key="user.id">
                  <td>{{ user.id }}</td>
                  <td>{{ user.name | capitalize }}</td>
                  <td>{{ user.email }}</td>
                  <td>
                    {{ user.created_at | myDate }}
                  </td>
                  <td>{{user.type}}</td>
                  <td>
                    <a href="#" @click.prevent="editUser(user)"
                      ><i class="fa fa-edit"></i
                    ></a>
                    /
                    <a href="#" @click.prevent="deleteUser(user.id)"
                      ><i class="fa fa-trash text-danger"></i
                    ></a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- /.card-body -->
          <div class="card-footer">
            <pagination :data="users" @pagination-change-page="getResults"></pagination>
          </div>
        </div>
        <!-- /.card -->
      </div>
    </div>
    <div v-if="!$get.isAdmin()">
      <not-found/>
    </div>
  </div>
</template>

<script>
import NotFound from './NotFound.vue';
import pagination from 'laravel-vue-pagination';
export default {
  components: { NotFound,pagination },
  name: "Users",
  data() {
    return {
      form: new Form({
        id: "",
        name: "",
        email: "",
        password: "",
        type: "",
        bio: "",
        photo: "",
      }),
      editMode: false,
      users: {},
    };
  },
  methods: {
    deleteUser(id) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          this.form
            .delete("api/user/" + id)
            .then(() => {
              Swal.fire("Deleted!", "Your file has been deleted.", "success");
              Fire.$emit("afterCreate");
            })
            .catch((err) => {
              Swal.fire("Failed!", "There was something wronge.", "warning");
              console.log(err);
            });
        }
      });
    },
    createUser() {
      this.$Progress.start();
      this.form
        .post("api/user")
        .then(() => {
          Fire.$emit("afterCreate");
          Toast.fire({
            icon: "success",
            title: "Created in successfully",
          });
          $("#addNewUser").modal("hide");
          this.$Progress.finish();
        })
        .catch((err) => {
          this.$Progress.fail();
          console.log(err);
        });
    },
    updateUser() {
      this.form
        .put("api/user/" + this.form.id)
        .then(() => {
          $("#addNewUser").modal("hide");
          Swal.fire("Updated!", "User has been updated.", "success");
          Fire.$emit("afterCreate");
          this.$Progress.finish();
        })
        .catch(() => {
          this.$Progress.fail();
        });
    },
    editUser(user) {
      this.editMode = true;
      $("#addNewUser").modal("show");
      this.form.fill(user);
    },
    newUser() {
      this.editMode = false;
      $("#addNewUser").modal("show");
      this.form.reset();
    },
    loadUsers() {
      if(this.$get.isAdmin()){
        axios.get("api/user").then(({ data }) => (this.users = data));
      }
    },
    getResults(page = 1) {
			axios.get('api/user?page=' + page)
				.then(response => {
					this.users = response.data;
				});
		}
  },
  created() {
    this.loadUsers();
    Fire.$on("afterCreate", () => {
      this.loadUsers();
    });
    Fire.$on('searching',()=>{
      let query = this.$parent.searchV;
      axios.get('api/findUser?q=' + query)
      .then((data)=>{
        this.users = data.data
      })
      .catch(()=>{

      });
    });
  },
};
</script>
