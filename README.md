# NASA Imagery Research

Need to search for some interesting facts about NASA?
Need quick and easy access to images from NASA?
Need all of this and so much more without the clutter of other pages?
Use our NASA Image Research Application
Check out our site for quick and concise information for your
research paper, group projects, own personal enrichment.
On our site you will be able to access:
NASA exclusive images;
NASA exclusive information; and
WIKIPEDIA backed information

## Tech Stack

**Code Languages:** This app will run in the browser with the help of Semantic UI while featuring dynamically updated HTML and CSS powered by JavaScript code.
NASA Image Search and Wikipedia APIs are embedded on the Home and Results page.

## API Reference

#### NASA Image and Video Library

```http
  https://images-api.nasa.gov/${aqPk4AkUldcMuw1FvY0C5ihXSMsdy5ftX7hG5RHN}
```

| Parameter     | Type     | Description                                                                       |
| :------------ | :------- | :-------------------------------------------------------------------------------- |
| `Description` | `string` | `Terms to search for in “Description” fields `                                    |
| `Keywords`    | `string` | `Terms to search for in “Keywords” fields. Separate multiple values with commas.` |
| `Title`       | `string` | `Terms to search for in “Title” fields.`                                          |
| `Year_Start`  | `string` | `The start year for results. Format: YYYY.`                                       |
| `Year_End`    | `string` | `The end year for results. Format: YYYY`                                          |

#### Wikipedia Search Bar

```http
  https://en.wikipedia.org/w/api.php
```

| Parameter     | Type                 | Description                                                                          |
| :------------ | :------------------- | :----------------------------------------------------------------------------------- |
| `Description` | `string or integers` | `The search the user can make from this search bar spans the entirety of Wikipedia.` |

####

####

## Deployment

https://gordon-magill.github.io/NASA_exploration/

https://github.com/Gordon-Magill/NASA_exploration

https://docs.google.com/presentation/d/1wEaU0H08qnuyKl7v5faaYsb-Lv2IPN5LAmyu9sulPRE/edit#slide=id.g1399f51fc92_0_0

## Search Bar Features

- Description of intended search (Required)
- Keywords of intended search
- Title of intended search
- Search by Date

## Authors

- [@Gordon Magill](https://github.com/Gordon-Magill)
- [@Prateek Verghese](https://github.com/iTeak)
- [@Santiago Campos](https://github.com/Everyone1138)
- [@Lamar Martin](https://github.com/lmartin214)

## Screenshots in Responsive Dimensions

![image](./assets/images/deployed/home.png)

![image](./assets/images/deployed/homeSearch.png)

![image](./assets/images/deployed/resultPage.png)

![image](./assets/images/deployed/meetTheTeam.png)

![image](./assets/images/deployed/errorPage.png)
