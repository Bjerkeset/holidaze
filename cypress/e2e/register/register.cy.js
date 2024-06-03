describe("Registration Test", () => {
    it("Successfully registers a new user with a random email and name", () => {
      const generateRandomString = (length) => Math.random().toString(36).substr(2, length);
  
      const randomEmail = `testuser${generateRandomString(8)}@noroff.no`;
      const randomUsername = `TestUser${generateRandomString(10)}`;
  
      cy.visit("http://localhost:3000/profile/auth");
      cy.contains("button", "Register").click();
  
      cy.get('input[type="email"]').type(randomEmail);
      cy.get('input[name="name"]').type(randomUsername);
      cy.contains("button", "Next Step").click();
      cy.get('input[type="password"]').first().type("password123");
      cy.get('input[type="password"]').last().type("password123");
      cy.contains("button", "Register Now").click();
  
      // Simplified to only check for success message
      cy.contains("User registered successfully!").should("be.visible");
    });
  });
  describe("Registration Duplicate Test", () => {
    it("Fails to register the same user twice", () => {
      const email = "testuser@noroff.no";
      const username = "TestUser";
  
      cy.visit("http://localhost:3000/profile/auth");
      cy.contains("button", "Register").click();
  
      cy.get('input[type="email"]').type(email);
      cy.get('input[name="name"]').type(username);
      cy.contains("button", "Next Step").click();
      cy.get('input[type="password"]').first().type("password123");
      cy.get('input[type="password"]').last().type("password123");
      cy.contains("button", "Register Now").click();
  
      // Simplified to only check for failure message
      cy.contains("Profile already exists").should("be.visible");
    });
  });
  