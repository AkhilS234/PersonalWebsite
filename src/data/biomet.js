export const biomet = [
  {
    "id": "approach",
    "title": "From reports to model inputs",
    "paragraphs": [
      "Company sustainability reports contain more than emissions totals. They also describe plans, investment priorities and how a company talks about reducing its footprint. The question behind this project was whether that language could add useful signal to an emissions forecast.",
      "During my Biomet internship, I worked on a multi-stage LangChain pipeline to extract structured information from sustainability reports for 15 automakers, using GPT-4o, schema validation and retries for malformed outputs. The forecasting work combined sentiment features with financial and emissions data.",
      "The public GHGPredictor app provides a smaller, upload-based way to explore that idea. A user supplies historical CSV data, company reports as text files and actual 2023 emissions for comparison. It matches company names across files and turns report text into a numerical polarity feature.",
      "The README describes GPT-4o mini sentiment analysis. The current public app instead uses TextBlob: it selects sentences containing emissions-related keywords, averages their polarity and maps the result to a value between zero and one. If no sentences match, it scores the whole text."
    ]
  },
  {
    "id": "model",
    "title": "Forecasting emissions per vehicle",
    "paragraphs": [
      "The prediction target is greenhouse-gas emissions per vehicle. Rather than treating each company as a single static row, the model uses its recent history: previous emissions per vehicle, total emissions, net income, investment and changes in those quantities over time.",
      "The app builds lagged emissions and trend features from prior years, trains on available 2020–2022 observations and constructs a 2023 prediction row for each company with a matching report. Financial and emissions inputs for that row are extrapolated from the historical data, while report polarity supplies the text-derived feature.",
      "A scikit-learn pipeline standardizes numeric features, one-hot encodes company names and fits a GradientBoostingRegressor. Pandas handles the data preparation and NumPy handles trend fitting. Flask wraps the workflow in an upload form and a results table."
    ]
  },
  {
    "id": "results",
    "title": "Results and how to read them",
    "paragraphs": [
      "The project reports an improvement in R² from 0.40 to 0.76 after incorporating report sentiment. That comparison motivated the idea that disclosure language could add information beyond the financial and production variables.",
      "The public app joins its predictions to actual 2023 emissions and displays a company-by-company comparison with an R² score. There is an important distinction between that display and an independent forecast evaluation: the current code enables a calibration step that fits predictions to those same actual 2023 values before calculating R².",
      "The displayed score therefore reflects that calibration as well as the original model. The repository does not include the input datasets or a reproducible baseline-versus-sentiment experiment, so it cannot independently establish the reported 0.40-to-0.76 improvement. A clean follow-up would compare both models on the same untouched time split, keeping calibration separate from the final evaluation."
    ]
  },
  {
    "id": "reflection",
    "title": "What this project points to next",
    "paragraphs": [
      "This project brings together two kinds of information that are usually handled separately: structured financial and emissions records, and the language in sustainability disclosures. Making them useful together requires careful company matching, consistent feature construction and a clear boundary between training information and evaluation data.",
      "The repository identifies several directions for further work: broader sources for trend analysis, regional differences among manufacturers and wider ESG sentiment. Those would be useful hypotheses to test rather than assumptions to add to a model.",
      "The immediate priority would be a reproducible evaluation with saved datasets, a numerical-only baseline and an otherwise identical sentiment-augmented model. That would make it easier to tell whether the text feature adds signal, and whether the gain holds beyond this collection of reports."
    ]
  }
];
