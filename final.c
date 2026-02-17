#include<stdio.h>
#include<stdlib.h>   
#define col 100  
#define row 100

struct collection {
    char name[col];
    char size[col];
    char color[col];
    int id;
    int quantity;
    float price;
};

// FUNCTION PROTOTYPE
void addEntries(struct collection item[], int *count);
int checkId(struct collection item[], int count, int newId);
void modification(struct collection item[], int count);
void display(struct collection item[],int count);
void deleteItem(struct collection[],int *count);


int main(){
    struct collection item[row];
    int choose;
    int count = 0;

    printf("\t\t-----------------------\n");
    printf("\t\tWELCOME TO SAYYAM STORE :\n");
    printf("\t\t-------------------------\n");

    do {
        printf("\t\t1 : Add Entries :\n");
        printf("\t\t2 : Modify Entries :\n");
        printf("\t\t3 : Display Collection:\n");
        printf("\t\t4:  Delete Collection:\n");
        printf("\t\t0 : Exit the Program \n");
     

        printf("Choose 1 to 4,and 0 for exit the program\n");

        if (scanf("%d", &choose) != 1 || choose < 0) {
            printf("Invalid input. Please enter a number.\n");
            // Clear the input buffer to avoid an infinite loop
            while (getchar() != '\n');
            // Continue the loop to  the user again enter 
            continue;  // user enter karey ga to yh enext iteration pr move kar jaiey ga
        }

        switch (choose) {
            case 1:
                addEntries(item, &count);
                break;

            case 2:
                modification(item, count);
                printf("Press Enter to Continue:\n");
                while(getchar() != '\n');
                getchar();
                break;
                

            case 3:
                display(item,count);
                printf("Press Enter to Continue :\n");
                while(getchar() != '\n'); // clear input buffer
                getchar();
                break;

            case 4:
                deleteItem(item,&count);
                printf("Press Enter to Continue:\n");
                while(getchar() != '\n');
                getchar();
                break;
                
            case 0:
                printf("Good Bye ! Thanks for getting Our services.\n");
                while(getchar() != '\n');
                getchar();
                break;

        } system("clear");
    } while (choose != 0);

    return 0;
}

// FUNCTION DEFINITION
void addEntries(struct collection item[], int *count) {
    int newid;
    int idStatus;

    do {
        printf("Enter Item Name :\n");
        getchar();
        scanf("%[^\n]s", item[*count].name);
        getchar();

        printf("Enter Id :\n");
        scanf("%d", &newid);

        idStatus = checkId(item, *count, newid); // we call idstatus checker function.

        if (idStatus == 1) {
            printf("%d id is already taken :\n", newid);
        } else { 
            item[*count].id = newid;
        }

    } while (idStatus != 0);

    printf("Enter size :\n");
    getchar();
    scanf("%[^\n]s", item[*count].size);
    getchar();

    printf("Enter Colour :\n");
    scanf("%99[^\n]s", item[*count].color);
    getchar();

    do {
        printf("Enter Quantity :\n");
        scanf("%d", &item[*count].quantity);

        if (item[*count].quantity < 0) {
            printf("Error: Quantity cannot be negative. Please enter a non-negative value:\n");
        }

    } while (item[*count].quantity < 0);

    do {
        printf("Enter Price :\n");
        scanf("%f", &item[*count].price);

        if (item[*count].price < 0) {
            printf("Error: Price cannot be negative. Please enter a non-negative value:\n");
        }

    } while (item[*count].price < 0);

    (*count)++;
}

int checkId(struct collection item[], int count, int newId) {
    for (int i = 0; i < count; i++) {
        if (item[i].id == newId) {
            return 1;
        }
    }
    return 0;
}

void modification(struct collection item[], int count) {
  //  char ch;
    int targetId = 0;
    int found = 0;

     
     
       

    printf("Enter the ID of the item to modify:\n");
    scanf("%d", &targetId);
    
   
    for (int i = 0; i < count; i++) {
    
    
     
        if (item[i].id == targetId  ) {
            found = 1;

            printf("\t\t\v============================\n");
            printf("\t\tSelected Id  Previous Data :\n");
            printf("\t\tName  \t\t%s\n", item[i].name);
            printf("\t\tSize  \t\t%s\n", item[i].size);
            printf("\t\tColor  \t\t%s\n", item[i].color);
            printf("\t\tQuantity \t %d\n", item[i].quantity);
            printf("\t\tPrice  \t\t%f\n", item[i].price);
            printf("\t\t\v==========================\n");

            printf("\vEnter new information about items:\n");
            printf("Enter New Name :\n");
            getchar();
            scanf("%[^\n]s", item[i].name);
            getchar();

            printf("Enter Updated Size :\n");
            getchar();
            scanf("%[^\n]s", item[i].size);
            getchar();

            printf("Enter New Color :\n");
            getchar();
            scanf("%[^\n]s", item[i].color);
            getchar();

            // Enter New Quantity (ensuring it's positive)
            do {
                printf("Enter New Quantity:\n");
                scanf("%d", &item[i].quantity);

                if (item[i].quantity < 0) {
                    printf("Error: Quantity cannot be negative. Please enter a non-negative value:\n");
                }

            } while (item[i].quantity < 0);

            // Enter New Price (ensuring it's positive)
            do {
                printf("Enter New Price :\n");
                scanf("%f", &item[i].price);

                if (item[i].price < 0) {
                    printf("Error: Price cannot be negative. Please enter a non-negative value:\n");
                }

            } while (item[i].price < 0);

            printf("Item Modified successfully.\n");
        }
        
    }

    if (!found) {
        printf("Sorry, ID NOT FOUND..\n");
    }
}

// FUNCTION DEFINATIO FOR DISPlaying

void display(struct collection item[], int count) {
    if (count == 0) {
        printf("Collection is Empty :\n");
    } else {
        printf("\t\t\v-----------------------\n");
        printf("\t\tDisplaying Collection :\n");

        for (int i = 0; i < count; i++) {
            printf("\t\t\v-------------------------\n");
            printf("\t\tItem ID : \t%d\n", item[i].id);
            printf("\t\tName: \t\t%s\n", item[i].name);
            printf("\t\tSize: \t\t%s\n", item[i].size);
            printf("\t\tColor: \t\t%s\n", item[i].color);
            printf("\t\tQuantity : \t%d\n", item[i].quantity);
            printf("\t\tPrice : \t%.6f\n", item[i].price);
            printf("\t\t\v--------------------------\n");
        }
    }
}

void deleteItem(struct collection item[],int *count)
{
    int targetId;
    int found = -1;

    printf("Enter the target Id yoy want to remove :\n");
    scanf("%d",&targetId);

    for(int i =0 ;i < *count;i++)
    {
        if(item[i].id == targetId)
        {
            found = i;
            break;
        }
    }

    if(found != -1 )
    {
        for(int i = found; i < *count - 1; i++)
        {
            item[i] = item[i+1];
        }
        (*count)--;

        printf("Item with ID %d deleted Succesfully :\n",targetId);
    }

    else{
        printf("Item with Id %d not found :\n",targetId);
    }
}

