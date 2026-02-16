const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_ANON_KEY';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// =============================
// CHECK IF USER IS LOGGED IN
// =============================
async function checkUser() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    window.location.href = "login.html";
  }
  return user;
}

// =============================
// SIGN UP
// =============================
document.addEventListener("DOMContentLoaded", () => {

  const signupForm = document.getElementById("signup-form");

  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const full_name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const phone = document.getElementById("phone").value;
      const password = document.getElementById("password").value;

      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) {
        alert(error.message);
        return;
      }

      // Insert into profiles table
      const userId = data.user.id;

      const { error: profileError } = await supabase
        .from("profiles")
        .insert([
          {
            id: userId,
            full_name,
            phone,
            role: "customer"
          }
        ]);

      if (profileError) {
        alert(profileError.message);
      } else {
        alert("Signup successful! Please confirm your email.");
        window.location.href = "login.html";
      }
    });
  }

  // =============================
  // LOGIN
  // =============================
  const loginForm = document.getElementById("login-form");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email-login").value;
      const password = document.getElementById("password-login").value;

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        alert(error.message);
      } else {
        window.location.href = "index.html";
      }
    });
  }

});