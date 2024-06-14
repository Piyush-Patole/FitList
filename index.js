import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = process.env.PORT || 3000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "fitlist",
    password: "123456",
    port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

app.get("/", async (req, res) => {
    try{
        const result = await db.query("SELECT * from exercises ORDER BY id ASC");
        const exercises = result.rows;

        res.render("index", {
            listTitle: "Exercise List",
            listItems: exercises,
        });
    }catch (err) {
        console.log(err);
    }
});

app.post("/add", async (req, res) => {
    const{ exercise_name, sets, reps, notes } = req.body;
    try{
        await db.query("INSERT INTO exercises (exercise_name, sets, reps, notes) VALUES ($1, $2, $3, $4)", [exercise_name, sets, reps, notes]);
        res.redirect("/");
    }catch(err){
        console.log(err);
    }
});

app.post("/edit", async (req, res) => {
    const{updatedExerciseName, updatedSets, updatedReps, updatedNotes, id } = req.body;
    try{
        await db.query("UPDATE exercises SET exercise_name = $1, sets = $2, reps = $3, notes = $4 where id = $5", [updatedExerciseName, updatedSets, updatedReps, updatedNotes, id]);
        res.redirect("/");
    }catch(err){
        console.log(err);
    }
});

app.post("/delete", async (req, res) => {
    const id = req.body.deleteItemId;
    try{
        await db.query("DELETE FROM exercises WHERE id =$1", [id]);
        res.redirect("/");
    }catch(err){
        console.log(err);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});