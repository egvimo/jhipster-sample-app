package sample.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import sample.web.rest.TestUtil;

class Abc18Test {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Abc18.class);
        Abc18 abc181 = new Abc18();
        abc181.setId(1L);
        Abc18 abc182 = new Abc18();
        abc182.setId(abc181.getId());
        assertThat(abc181).isEqualTo(abc182);
        abc182.setId(2L);
        assertThat(abc181).isNotEqualTo(abc182);
        abc181.setId(null);
        assertThat(abc181).isNotEqualTo(abc182);
    }
}
