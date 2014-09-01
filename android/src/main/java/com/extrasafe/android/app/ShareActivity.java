package com.extrasafe.android.app;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.res.AssetManager;
import android.os.Bundle;
import android.support.v7.app.ActionBarActivity;
import android.text.InputType;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import com.evgenii.jsevaluator.JsEvaluator;
import com.evgenii.jsevaluator.interfaces.JsCallback;

import java.io.IOException;
import java.io.InputStream;


public class ShareActivity extends ActionBarActivity {

    String hasher = null;
    String sha3 = null;
    String siteTag = "";
    String callFunction = "Hasher.passy('<masterPassword>','<siteTag>')";
    String optionsFunction = "Hasher.extraSecuritySequence=\"<<extraSecuritySequence>>\"; "+"Hasher.start=<<startIndex>>; "+"Hasher.end=<<endIndex>>; ";
    Context context = this;
    boolean eyeOn = false;
    String extraSecuritySequence = "";
    int startIndex = 0;
    int endIndex = 12;
    String extraSecuritySequenceKey = "extraSecuritySequenceKey";
    String startIndexKey = "startIndexKey";
    String endIndexKey = "endIndexKey";
    SharedPreferences preferences;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_both);
        preferences = getSharedPreferences("Extrasafe Preferences", Context.MODE_PRIVATE);
        initialize();
    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();
        if (id == R.id.settingsButton) {
            Intent settingsIntent = new Intent(this, SettingsActivity.class);
            //settingsIntent.putExtra("key", value); //Optional parameters
            this.startActivity(settingsIntent);
            return true;
        }
        return super.onOptionsItemSelected(item);
    }


    public void generatePassword(View view) throws IOException {
        TextView masterPasswordField = (TextView) findViewById(R.id.masterPassword);

        if(masterPasswordField.getText().length() == 0){
            Toast.makeText(this, "Enter your master password", Toast.LENGTH_SHORT).show();
            return;
        }
        if(siteTag.length() == 0){
            Toast.makeText(this, "Site Tag is empty, try manually adding site tag in extrasafe launched from menu", Toast.LENGTH_LONG).show();
            return;
        }

        JsEvaluator jsEvaluator = new JsEvaluator(this);
        if(hasher != null && sha3 != null){
            hasher+=constructOptionsCall();
            String call = callFunction.replace("<masterPassword>",masterPasswordField.getText()).replace("<siteTag>",siteTag);
            String text = hasher+sha3+call;
            jsEvaluator.evaluate(text, new JsCallback() {
                @Override
                public void onResult(final String result) {
                    copyToClipboard(context, result);
                }
            });
        }
        else{
            Toast.makeText(this, "Problem in generating site password, please use our backup plan saipranav.github.io/extrasafe/portable", Toast.LENGTH_SHORT).show();
            //don't worry! we have a backup plan saipranav.github.io/extrasafe/portable
            return;
        }
        return;
    }

    public String extractSiteTagFromUrl(String url){
        siteTag = "";

        //Remove the http:// tag if its in siteTag there.
        if(url.indexOf("://") > 0){
            url = url.substring(url.indexOf("://") + 3, url.length());
        }
        //Split the url with "/"
        url = url.split("/")[0];

        //Split the url with ".".
        String[] siteUrlBreakupArray = url.split("\\.");

        if(siteUrlBreakupArray.length == 1){
            siteTag = siteUrlBreakupArray[0];
            return siteTag;
        }

        //check the array strings with the pattern.
        for(int i=0; i<siteUrlBreakupArray.length; i++){
            String tempVar = siteUrlBreakupArray[i];
            if(tempVar.matches("^(com|org|net|int|edu|gov|mil|co)($|[^a-zA-Z0-9])") || tempVar.matches("^(in|ae|an|aq|ar|au|bd|be|bm|br|bw|ca|ch|cl|cn|cr|cs|cu|cz|de|dk|eg|es|eu|fi|fr|gb|ge|gl|gr|hk|hu|id|ie|il|iq|ir|is|it|jm|jp|ke|kh|kw|lk|mm|mn|mx|my|ng|np|nz|om|pe|pt|qa|ro|ru|sa|se|sg|su|th|uk|us|uz|va|ve|vn|za|zw)($|[^a-zA-Z0-9])")){
                siteTag = siteUrlBreakupArray[i-1];
                break;
            }
        }
        return siteTag;
    }

    public boolean copyToClipboard(Context context, String text) {
        try {
            int sdk = android.os.Build.VERSION.SDK_INT;
            if (sdk < android.os.Build.VERSION_CODES.HONEYCOMB) {
                android.text.ClipboardManager clipboard = (android.text.ClipboardManager) context
                        .getSystemService(context.CLIPBOARD_SERVICE);
                clipboard.setText(text);
                Toast.makeText(context, "Your site password copied to clipboard", Toast.LENGTH_SHORT).show();
            } else {
                android.content.ClipboardManager clipboard = (android.content.ClipboardManager) getSystemService(Context.CLIPBOARD_SERVICE);
                android.content.ClipData clip = android.content.ClipData.newPlainText("generated password", text);
                clipboard.setPrimaryClip(clip);
                Toast.makeText(context, "Your site password copied to clipboard", Toast.LENGTH_SHORT).show();
            }
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public void onEyeClick(View view) throws IOException{
        TextView masterPasswordField = (TextView) findViewById(R.id.masterPassword);
        if(eyeOn){
            masterPasswordField.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_PASSWORD);
            eyeOn = false;
        }
        else{
            masterPasswordField.setInputType(InputType.TYPE_CLASS_TEXT);
            eyeOn = true;
        }
    }

    public void initialize(){
        AssetManager assetManager = getAssets();
        if(hasher == null || sha3 == null){
            hasher = getJs(assetManager,"hasher.js").replaceAll("\\r\\n|\\r|\\n", " ");
            sha3 = getJs(assetManager,"sha3.js").replaceAll("\\r\\n|\\r|\\n", " ");
        }

        String url = this.getIntent().getStringExtra(Intent.EXTRA_TEXT);
        if(url != null){
            siteTag = extractSiteTagFromUrl(url);
            if(siteTag.equals("")){
                Toast.makeText(this, "Problem in extracting site url tag", Toast.LENGTH_SHORT).show();
                //don't worry! we have a backup plan saipranav.github.io/extrasafe/portable
                return;
            }
        }
        TextView urlField = (TextView) findViewById(R.id.siteTag);
        urlField.setText(siteTag);

        TextView masterPasswordField = (TextView) findViewById(R.id.masterPassword);
        if(getIntent().getComponent().getClassName().contains("ShareActivity")){
            masterPasswordField.requestFocus();
        }
    }

    public String getJs(AssetManager assetManager,String file) {
        InputStream input;
        try {
            input = assetManager.open(file);
            int size = input.available();
            byte[] buffer = new byte[size];
            input.read(buffer);
            input.close();
            return new String(buffer);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    public String constructOptionsCall(){
        if(preferences==null || !preferences.contains(extraSecuritySequenceKey) || !preferences.contains(startIndexKey) || !preferences.contains(endIndexKey)){
            extraSecuritySequence = "";
            startIndex = 0;
            endIndex = 12;
        }
        else{
            extraSecuritySequence = preferences.getString(extraSecuritySequenceKey, "");
            startIndex = preferences.getInt(startIndexKey, 0);
            endIndex = preferences.getInt(endIndexKey, 12);
        }

        return optionsFunction.replaceAll("<<extraSecuritySequence>>",extraSecuritySequence).replaceAll("<<startIndex>>",String.valueOf(startIndex)).replaceAll("<<endIndex>>",String.valueOf(endIndex));
    }

}
