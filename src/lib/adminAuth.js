/* Simple client-side admin auth helpers using localStorage.
   Not secure for production. Meant for demo only.
*/
(function(window){
  var STORAGE_USERS = 'wm_users';
  var STORAGE_SESSION = 'wm_session';

  function _getUsers(){
    try{ return JSON.parse(localStorage.getItem(STORAGE_USERS) || '[]'); }catch(e){ return []; }
  }
  function _setUsers(users){ localStorage.setItem(STORAGE_USERS, JSON.stringify(users)); }

  function signup(username, password){
    if(!username || !password) return {ok:false, error:'username and password required'};
    var users = _getUsers();
    if(users.find(function(u){ return u.username === username;})){
      return {ok:false, error:'user exists'};
    }
    users.push({username: username, password: password});
    _setUsers(users);
    return {ok:true};
  }

  function login(username, password){
    var users = _getUsers();
    var u = users.find(function(x){ return x.username === username && x.password === password; });
    if(!u) return {ok:false, error:'invalid credentials'};
    // create a simple session token
    var token = btoa(username + ':' + Date.now());
    localStorage.setItem(STORAGE_SESSION, JSON.stringify({username: username, token: token}));
    return {ok:true, token: token};
  }

  function logout(){
    localStorage.removeItem(STORAGE_SESSION);
  }

  function isAuthenticated(){
    try{ return !!JSON.parse(localStorage.getItem(STORAGE_SESSION)); }catch(e){ return false; }
  }

  function currentUser(){
    try{ return JSON.parse(localStorage.getItem(STORAGE_SESSION)) || null; }catch(e){ return null; }
  }

  function requireAuth(redirectTo){
    if(!isAuthenticated()){
      window.location.href = (redirectTo || 'admin_login.html');
    }
  }

  window.adminAuth = {
    signup: signup,
    login: login,
    logout: logout,
    isAuthenticated: isAuthenticated,
    currentUser: currentUser,
    requireAuth: requireAuth
  };
})(window);
