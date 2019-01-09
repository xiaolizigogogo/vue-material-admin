<template>
  <v-app id="login" class="primary">
    <v-snackbar
      :timeout="timeout"
      :color="color"
      :top="'top'"
      v-model="snackbar"
    >
      {{ text }}
    </v-snackbar>
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4 lg4>
            <v-card class="elevation-1 pa-3">
              <v-card-text>
                <div class="layout column align-center">
                  <img src="/static/m.png" alt="Vue Material Admin" width="120" height="120">
                  <h1 class="flex my-4 primary--text">New Faces 收银系统</h1>
                </div>                
                <v-form v-model="valid" lazy-validation ref="form">
                  <v-text-field append-icon="person" name="login" label="Login" type="text" v-model="model.username" placeholder="请输入用户名" :rules="rules.nameRules"></v-text-field>
                  <v-text-field append-icon="lock" name="password" label="Password" id="password" type="password" v-model="model.password" placeholder="请输入密码" :rules="rules.passwordRules"></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn icon>
                  <!-- <v-icon color="blue">fa fa-facebook-square fa-lg</v-icon> -->
                </v-btn>
                <v-btn icon>
                  <!-- <v-icon color="red">fa fa-google fa-lg</v-icon> -->
                </v-btn>
                <v-btn icon>
                  <!-- <v-icon color="light-blue">fa fa-twitter fa-lg</v-icon> -->
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn block color="primary" @click="login" :loading="loading">Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
/* eslint-disable */
import { setStore } from "@/util/storage";
import Cookies from "js-cookie";
export default {
  data: () => ({
    loading: false,
    valid: true,
    text: '',
    snackbar: false,
    timeout: 2000,
    color:'success',
    model: {
      username: '',
      password: ''
    },
    saveLogin: true,
    rules:{
    nameRules: [
        v => !!v || '用户名不能为空',
        v => (v && v.length <= 10) || 'Name must be less than 10 characters'
    ],
    passwordRules:[
        v => !!v || '密码不能为空',
        v => (v && v.length <= 10) || 'Name must be less than 10 characters'
    ]    
    }
  }),

  methods: {
    login () {
      this.loading = true;
      if (this.$refs.form.validate()) {
          this.postRequest("/login", {
              username: this.model.username,
              password: this.model.password,
              saveLogin: this.saveLogin
            }).then(res=>{
               this.loading = false;
                if(res.code==200){
                  this.snackbar = true;
                  this.color= 'success';
                  this.text = '登陆成功';
                setStore("accessToken", res.result);
                if (this.saveLogin) {
                  localStorage.saveLogin = "true";
                }
                // 获取用户信息
                this.getRequest("/user/info").then(res => {
                  if (res.success === true) {
                    // 避免超过大小限制
                    delete res.result.permissions;
                    Cookies.set("userInfo", JSON.stringify(res.result));
                    setStore("userInfo", res.result);
                    // this.$store.commit("setAvatarPath", res.result.avatar);
                    // 加载菜单
                    // util.initRouter(this);
                    this.$router.push({
                      path: "/dashboard"
                    });
                  } else {
                    this.loading = false;
                  }
                });          
                }
                else{
                  this.snackbar = true;
                  this.color = 'error';
                  this.text = res.message;  
                }
            })
      }else{
        this.loading = false;
      }

    }
  }
};
</script>
<style scoped lang="css">
  #login {
    height: 50%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    content: "";
    z-index: 0;
  }
</style>
