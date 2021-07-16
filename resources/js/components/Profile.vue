<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-12">
        <div class="card card-widget widget-user">
          <!-- Add the bg color to the header using any of the bg-* classes -->
          <div
            class="widget-user-header text-white"
            style="background-image: url('./img/photo1.png')"
          >
            <h3 class="widget-user-username text-right">{{ form.name }}</h3>
            <h5 class="widget-user-desc text-right">Web Designer</h5>
          </div>
          <div class="widget-user-image">
            <img class="img-circle" :src="getProfilePhoto()" alt="User Avatar" />
          </div>
          <div class="card-footer">
            <div class="row">
              <form class="form-horizontal col-12 mt-5">
                      <div class="form-group row">
                        <label for="inputName" class="col-sm-2 col-form-label">Name</label>
                        <div class="col-sm-10">
                          <input type="email" v-model="form.name" class="form-control" id="inputName" placeholder="Name">
                        </div>
                      </div>
                      <div class="form-group row">
                        <label for="inputEmail" class="col-sm-2 col-form-label">Email</label>
                        <div class="col-sm-10">
                          <input type="email" v-model="form.email" class="form-control" id="inputEmail" placeholder="Email" :class="{ 'is-invalid': form.errors.has('email') }">
                          <has-error :form="form" field="email"></has-error>
                        </div>
                      </div>
                      <div class="form-group row">
                        <label for="inputExperience" class="col-sm-2 col-form-label">Experience</label>
                        <div class="col-sm-10">
                          <textarea class="form-control" v-model="form.bio" id="inputExperience" placeholder="Experience"></textarea>
                        </div>
                      </div>
                      <div class="form-group row">
                        <label for="inputSkills" class="col-sm-2 col-form-label">Skills</label>
                        <div class="col-sm-10">
                          <input type="text" class="form-control" id="inputSkills" placeholder="Skills">
                        </div>
                      </div>
                      <div class="form-group row">
                          <label id="inputPhoto" class="col-sm-2 col-form-label">Profile Photo</label>
                        <div class="col-sm-10">
                          <input type="file" @change="uplaodPhoto" id="inputPhoto">
                        </div>
                      </div>
                      <div class="form-group row">
                        <div class="offset-sm-2 col-sm-10">
                          <button type="submit" @click.prevent="updateInfo" class="btn btn-danger">Submit</button>
                        </div>
                      </div>
                    </form>
            </div>
            <!-- /.row -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.widget-user .widget-user-header {
  background-position: center center;
  background-size: cover;
  height: 250px;
}
.widget-user .widget-user-image {
  top: 205px;
}
</style>

<script>
export default {
  name: "Profile",
  data() {
    return {
      form: new Form({
        id: "",
        name: "",
        email: "",
        bio: "",
        photo: "",
      }),
    };
  },
  methods:{
    uplaodPhoto(e){
      let file = e.target.files[0];
      let reader = new FileReader();
      if(file['size'] < 2111775){
        reader.onloadend = ()=> {
          this.form.photo = reader.result;
        }
        reader.readAsDataURL(file)
      } else {
        Swal.fire("Failed!", "There was something wronge.", "warning");
      }
    },
    updateInfo(){
      this.$Progress.start();
      this.form.put('api/profile')
      .then(()=>{
        axios.get("api/profile").then(({ data }) => this.form.fill(data));
        this.$Progress.finish();
      })
      .catch(()=>{
        this.$Progress.fail();
      })
    },
    getProfilePhoto(){
      let photo = (this.form.photo.length > 100) ? this.form.photo : "img/profile/"+this.form.photo;
      return photo;
    }
  },
  mounted() {
    console.log("Profile Component mounted.");
  },
  created() {
    axios.get("api/profile").then(({ data }) => this.form.fill(data));
  },
};
</script>
